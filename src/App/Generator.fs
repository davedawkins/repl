[<RequireQualifiedAccess>]
module Fable.Repl.Generator

open System.Text.RegularExpressions
open Fable.Core
open Fable.Core.JsInterop
open Browser.Types
open Browser
open Prelude

let [<Global>] URL: obj = jsNative

let defaultHtmlCode =
    """
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    </head>
    <body>
    </body>
</html>
    """.Trim()

let private bubbleMouseEvents =
    """
<body>
    <script>

    (function () {
        var nativeConsoleLog = console.log;
        var nativeConsoleWarn = console.warn;
        var nativeConsoleError = console.error;
        var origin = window.location.origin;

        console.log = function() {
            var firstArg = arguments[0];
            if (arguments.length === 1 && typeof firstArg === 'string') {
                parent.postMessage({
                    type: 'console_log',
                    content: firstArg
                }, origin);
            }
            nativeConsoleLog.apply(this, arguments);
        };

        console.warn = function() {
            var firstArg = arguments[0];
            if (arguments.length === 1 && typeof firstArg === 'string') {
                parent.postMessage({
                    type: 'console_warn',
                    content: firstArg
                }, origin);
            }
            nativeConsoleWarn.apply(this, arguments);
        };

        console.error = function() {
            var firstArg = arguments[0];
            if (arguments.length === 1 && typeof firstArg === 'string') {
                parent.postMessage({
                    type: 'console_error',
                    content: firstArg
                }, origin);
            }
            nativeConsoleError.apply(this, arguments);
        };

        document.addEventListener("mousemove", function (ev) {
            window.parent.postMessage({
                type: "mousemove",
                x: ev.screenX,
                y: ev.screenY
            }, origin);
        });

        document.addEventListener("mouseup", function (ev) {
            window.parent.postMessage({
                type: "mouseup"
            }, origin);
        });

        // Tab key presses change focus to JS code view and cause glitches
        document.addEventListener("keydown", function (ev) {
            if (ev.keyCode === 9) ev.preventDefault();
        });
    })();
    </script>
    """.Trim()

let private bundleScriptTag code = sprintf "<script type=\"module\">\n%s\n</script>\n</body>" code

let private bundleLinkTag style =  sprintf """<link rel="stylesheet" type="text/css" href="%s">""" style

type MimeType =
    | Html
    | JavaScript
    | Css

let generateBlobURL content mimeType : string =
    let parts: obj[] = [| content |]
    let options =
        jsOptions<BlobPropertyBag>(fun o ->
            o.``type`` <-
                match mimeType with
                | Html -> "text/html"
                | JavaScript -> "text/javascript"
                | Css -> "text/css")
    URL?createObjectURL(Blob.Create(parts, options))

let private addLinkTag (cssCode : string) =
    if cssCode <> "" then
        generateBlobURL cssCode Css
        |> bundleLinkTag
    else
        ""

let generateHtmlBlobUrl (htmlCode : string) (cssCode : string) (jsCodeA : string array) (names: string array) =
    console.dir(jsCodeA)

    // We need to convert import paths to absolute urls and add .js at the end if necessary
    let mapFableLib jsCode =
        let reg = Regex(@"^import (.*)""(fable-library|fable-repl-lib)(.*)""(.*)$", RegexOptions.Multiline)
        reg.Replace(jsCode, fun (m:Match) ->
            let baseDir =
                if m.Groups.[2].Value = "fable-repl-lib"
                then Literals.FABLE_REPL_LIB_DIR
                else Literals.FABLE_LIBRARY_DIR
            let filename = Regex.Replace(m.Groups.[3].Value, "\.fs$", ".js")
            sprintf "import %s\"%s%s%s\"%s"
                m.Groups.[1].Value baseDir filename
                (if filename.EndsWith(".js") then "" else ".js")
                m.Groups.[4].Value)

    let createModuleUrl (mappings : Map<string,string>) (jsCode : string) =
        let reg2 = Regex(@"^\s*import (.*)""(\.\/|)([\w\d_.]+)""(.*)$", RegexOptions.Multiline)
        let mapLocal jsCode = reg2.Replace(jsCode, fun (m:Match) ->
                let (m1,m2,m3) = (m.Groups.[1].Value,m.Groups.[3].Value,m.Groups.[4].Value)
                let mapped = if mappings.ContainsKey m2 then mappings.[m2] else m2
                sprintf "import %s\"%s\"%s" m1 mapped m3)
        let mappedJs = (mapLocal << mapFableLib) jsCode
        generateBlobURL mappedJs MimeType.JavaScript

    // For multiple source files, we need to map
    //     import { xxx } from "./File.js";
    // to
    //     import { xxx } from <blob-url>;

    let htmlCode = htmlCode.Replace("__HOST__", Literals.HOST)

    let mutable mappings : Map<string,string> = Map.empty

    let modules =
        jsCodeA
        |> Array.zip names
        |> Array.map (fun (name,code) ->
            let url = createModuleUrl mappings code
            mappings <- mappings.Add(name,url)
            url
        )

    // Replacement function in JS is causing problems with $ symbol
    let i = htmlCode.IndexOf("</body>")
    let code =
        htmlCode.[..i-1]
        + bubbleMouseEvents
        + "<script>\n"
        + "import(\"" + (modules |> Array.last) + "\");\n"
        + "</script>\n"
        + addLinkTag cssCode
        + htmlCode.[i..]
    generateBlobURL code Html
