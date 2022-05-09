cp ../../Sutil/src/Sutil/*.fs src/Fable.Repl.Lib/Sutil
cp ../../Sutil/src/Sutil/webcomponentinterop.js src/Fable.Repl.Lib/Sutil
bash src/Export/build.sh
dotnet fake build -t BuildLib
cp ../Fable/src/fable-standalone/dist/*.min.js public/js/repl
cp ../Fable/src/fable-standalone/src/Worker/*.fs src/Standalone/Worker
npm run build
echo "You can now deploy using: 'npm run deploy:linode'"
