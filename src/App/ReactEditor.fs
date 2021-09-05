module Feliz.ReactEditor

open Fable.Core
open Fable.Core.JsInterop
open Feliz
open Browser.Types
open Browser

type IReactEditor =
    [<Emit("$0.editor")>]
    abstract Editor : Monaco.Editor.IStandaloneCodeEditor
    [<Emit("$0.monaco")>]
    abstract Monaco : Monaco.IExports
    [<Emit("$0.props.fileName")>]
    abstract FileName : string
    [<Emit("$0.props.isHidden")>]
    abstract IsHidden : bool
    [<Emit("$0.editor === null")>]
    abstract IsDisposed : bool
    [<Emit("$0.id")>]
    abstract Id : int


[<Erase>]
type editor =
    /// <summary>Triggered when the value of the Editor changed</summary>
    static member inline onChange (f : string -> unit) = Interop.mkAttr "onChange" f
    /// <summary>Triggered when the file name changed</summary>
    static member inline onFileNameChanged (f : IReactEditor -> unit) = Interop.mkAttr "onFileNameChanged" f
    /// <summary>Set the file name of the Editor</summary>
    static member inline fileName (name : string) = Interop.mkAttr "fileName" name
    /// <summary>Set the value of the Editor</summary>
    static member inline value (value : string) = Interop.mkAttr "value" value
    /// <summary>Triggered when the Editor has been mounted</summary>
    static member inline editorDidMount (f : System.Func<IReactEditor, unit>) = Interop.mkAttr "editorDidMount" f
    /// <summary>Triggered when the Editor has been unmounted</summary>
    static member inline editorDidUnmount (f : System.Func<IReactEditor, unit>) = Interop.mkAttr "editorDidUnmount" f
    /// <summary>Option to pass to the Editor</summary>
    static member inline options (options : Monaco.Editor.IEditorConstructionOptions) = Interop.mkAttr "options" options
    /// <summary>Errors to set into the editor
    /// <para>Currently only used for the F# editor</para>
    /// </summary>
    static member inline errors (errors : Monaco.Editor.IMarkerData[]) = Interop.mkAttr "errors" errors
    /// <summary>If specified the editor will listen to the provided event key
    /// <para>When sending the event, you need to provide an `eventType` in the detail</para>
    /// <para>Additional data might also be sent using others properties</para>
    /// </summary>
    static member inline eventId (eventId : string) = Interop.mkAttr "eventId" eventId
    /// <summary>If `true`, the editor is hidden</summary>
    static member inline isHidden (isHidden : bool) = Interop.mkAttr "isHidden" isHidden
    /// <summary>Custom class to add to the `react-editor` container</summary>
    static member inline customClass (customClass : string) = Interop.mkAttr "customClass" customClass

[<Erase>]
type ReactEditor =
    static member inline editor (properties : IReactProperty list) =
        Interop.reactApi.createElement(import "default" "./js/react-editor.js", createObj !!properties)

// /// Override style of the div container
// let inline Style (css: CSSProp seq): Props =
//     !!("style", keyValueList CaseRules.LowerFirst css)

// let inline editor (props: Props list) : ReactElement =
//     ofImport "default" "./js/react-editor.js" (keyValueList CaseRules.LowerFirst props) []


module Dispatch =

    let cursorMove (eventId : string) (range : Monaco.Editor.IMarkerData) =
        let data =
            jsOptions<CustomEventInit>(fun o ->
                o.detail <- createObj [
                    "eventType" ==> "cursorMove"
                    "range" ==> jsOptions<Monaco.IRange>(fun o ->
                        o.startLineNumber <- range.startLineNumber
                        o.startColumn <- range.startColumn
                        o.endLineNumber <- range.startLineNumber
                        o.endColumn <- range.startColumn
                    )
                ] |> Some
            )
        let event = CustomEvent.Create(eventId, data)
        window.dispatchEvent(event) |> ignore
