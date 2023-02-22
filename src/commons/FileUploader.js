import React from 'react'
import './FileUploader.scss'
import PropTypes from 'prop-types'

var propTypes = {
    baseColor: PropTypes.string,
    activeColor: PropTypes.string
},

defaultProps = {
    baseColor: 'gray',
    activeColor: 'green',
    overlayColor: 'rgba(255,255,255,0.3)'
};

class FileUploader extends React.Component {
constructor(props) {
    super(props);
    
    this.state = {
        active: false,
        fileSrc: '',
        loaded: false
    }
    
    this.onDragEnter  = this.onDragEnter.bind(this);
    this.onDragLeave  = this.onDragLeave.bind(this);
    this.onDrop       = this.onDrop.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
}

onDragEnter(e) {
    this.setState({ active: true });
}

onDragLeave(e) {
    this.setState({ active: false });
}

onDragOver(e) { 
    e.preventDefault(); 
}

onDrop(e) {
    e.preventDefault();
    this.setState({ active: false });
    this.onFileChange(e, e.dataTransfer.files[0]);
}

onFileChange = (e, file) => {
    var _this = this
    var file = file || e.target.files[0],
        pattern = /image-*/,
        reader = new FileReader();
        
    //   if (!file.type.match(pattern)) {
    //       alert('Formato inválido');
    //       return;
    //   }
    
    // this.setState({ loaded: false, });
    
    reader.onload = (e) => {
        var image = new Image()

        image.onload = function(){
        let { imageSize } = _this.props
        console.log("width", image.width)
            console.log("height", image.height)

            if(imageSize && (imageSize.width !== image.width || imageSize.height !== image.height)){
                _this.setState({ 
                    error: "Verifique as dimensões da imagem",
                }); 
            }else{
                _this.setState({ 
                    fileSrc: reader.result, 
                    fileType: file.type,
                    loaded: true,
                    error: null,
                }); 
    
                _this.props.onChange && _this.props.onChange(file)
            }

        }
        image.src = reader.result
    }
    
    reader.readAsDataURL(file);
}

getFileObject() {
    return this.refs.input.files[0];
}

getFileString() {
    return this.state.fileSrc;
}

render() {
    let state = this.state,
        props = this.props,
        labelClass  = `uploader ${state.fileType && state.fileType.match(/image-*/) && 'loaded'}`,
        borderColor = state.active ? props.activeColor : props.baseColor,
        iconColor   = state.active 
            ? props.activeColor
            : (state.fileType && state.fileType.match(/image-*/)) 
                ? props.overlayColor 
                : props.baseColor;
    
    return <div>
        <label 
            className={labelClass}
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave} 
            onDragOver={this.onDragOver}
            onDrop={this.onDrop}
            style={{outlineColor: borderColor}}>
                {
                    (props.fileSrc || state.fileSrc)
                    ? <img src={props.fileSrc || state.fileSrc} className={'loaded'}/>
                    : props.value
                        ? <span style={{color: 'green', fontWeight: 'bold'}}>{props.label} - Submetido</span>
                        : props.label
                }
                <i className="icon icon-upload" style={{ color: iconColor }}></i>
                <input type="file" onChange={this.onFileChange} ref="input" />
        </label>

        <div style={{fontSize: 11, padding: '10px 5px'}}>
            {this.props.imageSize && `Dimensões: ${this.props.imageSize.width} x ${this.props.imageSize.height}`}
        </div>
        {
            (this.props.error || this.state.error) &&
            <div style={{fontSize: 11, color: 'red', padding: '10px 5px'}}>
                {this.props.error || this.state.error}
            </div>
        }
    </div>
}
}

FileUploader.propTypes = propTypes;
FileUploader.defaultProps = defaultProps;

export default FileUploader;