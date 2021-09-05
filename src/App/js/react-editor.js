import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';


let ids = 0

class Editor extends React.Component {
    // editor = null;
    // monaco = null

    constructor(props) {
        super(props);
        this.id = ++ids;
        this.state = {
            width: 0,
            height: 0
        };
    }

    editorDidMount = (editor, monaco) => {
        this.editor = editor;
        this.monaco = monaco;
        this.props.editorDidMount(this); //editor, monaco);

        if (this.props.eventId !== null)
            window.addEventListener(this.props.eventId, ev => {
                switch (ev.detail.eventType) {
                    case "cursorMove":
                        this.editor.setSelection(ev.detail.range);
                        this.editor.focus();
                        this.editor.revealRangeInCenter(ev.detail.range);
                        break;
                    default:
                        break;
                }
            });
    }

    onChange = (newValue, e) => {
        this.props.onChange(newValue);
    }

    onResize = (width, height) => {
        if (this.editor !== null) {
            if (width !== undefined && height !== undefined)
                this.editor.layout({
                    width: width,
                    height: height
                });
            else
                this.editor.layout();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.errors !== this.props.errors) {
            this.monaco.editor.setModelMarkers(this.editor.getModel(), "FSharpErrors", this.props.errors);
            this.onResize();
        }

        if (prevProps.options !== this.props.options) {
            this.editor.updateOptions(this.props.options);
        }

        if (prevProps.fileName !== this.props.fileName) {
            this.props.onFileNameChanged(this);
        }
    }

    componentDidMount() {
        if (this.props.fileName !== "") {
            this.props.onFileNameChanged(this);
        }
    }

    componentWillUnmount() {
        console.log("Unmounting " + this.props.fileName)
        this.editor.dispose();
        this.editor = null;
        this.props.editorDidUnmount(this);
    }

    render() {
        let display = this.props.isHidden ? "none" : "block";
        let className = "react-editor " + this.props.customClass;
        return (
            <div className={className} x-filename={this.props.fileName} style={{ height: '100%', overflow: 'hidden', display: display }}>
                <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
                <MonacoEditor
                    value={this.props.value}
                    options={this.props.options}
                    onChange={this.onChange}
                    editorDidMount={this.editorDidMount}
                // requireConfig={requireConfig}
                />
            </div>
        );
    }
}

function noop() { }

Editor.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    editorDidMount: PropTypes.func,
    editorDidUnmount: PropTypes.func,
    options: PropTypes.object,
    errors: PropTypes.array,
    eventId: PropTypes.string,
    isHidden: PropTypes.bool,
    customClass: PropTypes.string,
    fileName: PropTypes.string,
    onFileNameChanged: PropTypes.func
};

Editor.defaultProps = {
    onChange: noop,
    value: "",
    editorDidMount: noop,
    editorDidUnmount: noop,
    options: null,
    errors: [],
    eventId: null,
    isHidden: false,
    customClass: "",
    fileName: "",
    onFileNameChanged: noop
};

export default Editor;
