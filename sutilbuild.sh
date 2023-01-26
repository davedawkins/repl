# Notes
#
# Check that the variables in src/Export/build.sh:
#   NCAVE_FSHARP_REPO=fsharp_ncave
#   REPL_REPO=repl
#
# match the references in src/Export/fcs-export.proj
#   <Reference Include="../../../fsharp_ncave/artifacts/bin/FSharp.Compiler.Service/Release/netstandard2.0/FSharp.Core.dll" />
#   <Reference Include="../../../fsharp_ncave/artifacts/bin/FSharp.Compiler.Service/Release/netstandard2.0/FSharp.Compiler.Service.dll" />
#
# There is currently an issue where .js files referenceed as SideEffects and Imports aren't being bundled
#
# Latest 'export' branch of ncave's fsharp repo is out of sync with src/Export/build.sh, in that projects have been relocated
# to fix this, have modifed build.sh:
#    git checkout export_2021-05-13
#
# Also modified fcs-export.proj to use net6.0
#
# To ensure paket has latest Sutil, then:
#  1. comment out entry for FULL_PROJECT in paket.dependencies
#  2. rm -rf paket-files
#  3. dotnet paket install  (or anything that rebuilds paket.lock
#  4. uncomment Sutil entry in paket.dependencies
#  5. repeat 2 and 3
#
# If you want to be sure then also
# % find . -name "Fable.Repl.Lib.dll*" -print -exec rm {} \;

rm src/Fable.Repl.Lib/Sutil/*
cp ../../Sutil/src/Sutil/*.fs src/Fable.Repl.Lib/Sutil
cp ../../Sutil/src/Sutil/webcomponentinterop.js src/Fable.Repl.Lib/Sutil
bash src/Export/build.sh
dotnet fake build -t BuildLib
cp ../Fable/src/fable-standalone/dist/*.min.js public/js/repl
cp ../Fable/src/fable-standalone/src/Worker/*.fs src/Standalone/Worker
npm run build
echo "You can now deploy using: 'npm run deploy:linode'"
