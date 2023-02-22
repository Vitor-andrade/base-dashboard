import React from 'react'
import MaskedInput from 'react-text-mask'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo'
import { TextField, Select, OutlinedInput, MenuItem, Checkbox, Input, InputLabel, FormControl, Popper, Grow, Paper, ClickAwayListener, MenuList, CircularProgress } from '@material-ui/core'
import { RadioGroup, Radio, FormControlLabel } from '@material-ui/core'
import FileUploader from './FileUploader'
// import Loading from './Loading'
import CurrencyInput from 'react-currency-input'; 
// import './Camera.css'
// import { removeAccents } from '../util/Util';
// import MyEditor from './MyEditor';

class RenderInput extends React.Component {
    state = {
        loadingFile: false,
        errorLoadFile: null,
        loadingUploadCamera: null,
        errorCamera: null,
    }

    onTakePhoto (dataUri) {
        this.onLoadCamera(dataUri)
        console.log('takePhoto');
    }

    onCameraError(error){
        console.log(error)
        this.setState({errorCamera: error})
    };
    onCameraStart(stream){};
    onCameraStop(){};

    onSearchCepError = data => {
        this.props.onError && this.props.onError(data.error)
        this.props.onChangeCep && this.props.onChangeCep({
            cep: data.cep,
            address: "",
            complement: "",
            neighborhood: "",
            uf: "",
            city: "",
        })
    }

    loadFileError = data => {
        this.setState({errorLoadFile: data.error || data.message, loadingFile: false})
    }

    onLoadFile = file => {
        this.setState({errorLoadFile: null, loadingFile: true})
        const formData = new FormData();
        formData.append("file", file)

        fetch(`${process.env.REACT_APP_SERVER_URL}/upload/file/${this.props.directory}`, {
            method: "POST", 
            body: formData,
            // headers: { Authorization: "Bearer " + (Auth.getUser().oauth || Auth.getUser().oauth_token) }
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) this.loadFileError(res)
            else if(res.uploadStatus){
                    this.props.onChange({file: res.file})
                    this.setState({loadingFile: false})
                }else this.loadFileError({error: "Falha ao subir arquivo"})
        })
        .catch(this.loadFileError)
    }

    generateFile = (dataUri, sliceSize) => {
        let contentType = dataUri.split(",")[0]
        let b64Data = dataUri.split(",")[1]
        sliceSize = sliceSize || 512;
      
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
      
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);
      
          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          var byteArray = new Uint8Array(byteNumbers);
      
          byteArrays.push(byteArray);
        }
      
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }
    
    loadCameraError = data => {
        this.setState({errorUploadCamera: data.error || data.message, loadingUploadCamera: false})
    }

    onLoadCamera = dataUri => {        
        this.setState({errorUploadCamera: null, loadingUploadCamera: true})
        const formData = new FormData();
        formData.append("file", this.generateFile(dataUri, 650))

        fetch(`${process.env.REACT_APP_SERVER_URL}/upload/file/${this.props.directory}`, {
            method: "POST", 
            body: formData,
            // headers: { Authorization: "Bearer " + (Auth.getUser().oauth || Auth.getUser().oauth_token) }
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) this.loadCameraError(res)
            else if(res.uploadStatus){
                    this.props.onChange({file: res.file})
                    this.setState({loadingUploadCamera: false})
                }else this.loadCameraError({error: "Falha ao subir arquivo"})
        })
        .catch(this.loadFileError)
    }

    onChangeCep = event => {
        let cep = (event.target.value).toString().replace(/ |\u2000|\.|\-|\//g, "")
        if(cep.length === 8){
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then((response) => {
                if(response.erro) this.onSearchCepError({cep: cep, error: "CEP inválido"});
                else{
                    this.props.onChangeCep && this.props.onChangeCep({
                        cep: response.cep,
                        address: response.logradouro,
                        complement: response.complemento,
                        neighborhood: response.bairro,
                        uf: response.uf,
                        city: response.localidade,
                    })
                }
            })
            .catch(err => { this.onSearchCepError({cep: cep, error: "Falha ao buscar CEP"}); })
        }else{
            this.props.onChangeCep && this.props.onChangeCep({
                cep: cep,
                address: "",
                complement: "",
                neighborhood: "",
                uf: "",
                city: "",
            })
        }
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      };

    render(){
        switch(this.props.component){
            case "cep":
                return <TextField 
                    InputLabelProps={{shrink: this.props.value !== null && this.props.value !== undefined && this.props.value !== ""}}
                    fullWidth
                    variant="outlined"
                    value={this.props.value}
                    onChange={event => { this.onChangeCep(event) }}
                    label={this.props.label}
                    disabled={this.props.disabled}
                    name={this.props.name}
                    InputProps={{inputComponent: TextMaskCep}}
                />
            case "checkbox":
                return <FormControlLabel 
                    control={<Checkbox />} 
                    checked={this.props.value} 
                    label={this.props.label} 
                    name={this.props.name}
                    onChange={this.props.onChange}
                />
            case "radio":
                return <RadioGroup 
                    style={{display: 'inline'}}
                    onChange={this.props.onChange}
                    name={this.props.name}
                    value={this.props.value === null || this.props.value === undefined ? "" : this.props.value}
                >
                    { this.props.empty && <FormControlLabel control={<Radio />} value={""} label={this.props.empty} /> }
                    { this.props.options.map(option => { 
                        return <FormControlLabel control={<Radio />} value={option.value} label={option.text} />
                    })}
                </RadioGroup>
            case "select":
                return <Select
                    style={{...this.props.style}}
                    value={this.props.value === null || this.props.value === undefined ? "" : this.props.value}
                    displayEmpty
                    disabled={this.props.disabled}
                    input={<OutlinedInput labelWidth={0} fullWidth name={this.props.name} style={{color: this.props.value === null || this.props.value === undefined && '#777777'}} />}
                    onChange={this.props.onChange}
                >
                    {this.props.label && <MenuItem value={""} disabled={!this.props.emptyEnabled}>Selecione - {this.props.label}</MenuItem>}
                    {
                        this.props.options && this.props.options.map(option => {
                            return <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
                        })
                    }
                </Select>
            case "camera":
                        return this.state.loadingUploadCamera
                        ? <CircularProgress />
                        : this.props.uploadedFile
                            ?  <div className="react-custom-camera">
                                <img width="100%" src={this.props.uploadedFile} />
                            </div>
                            : <div className="react-custom-camera">
                                <Camera
                                    onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
                                    onCameraError = { (error) => { this.onCameraError(error); } }
                                    idealFacingMode = {FACING_MODES.USER}
                                    idealResolution = {{width: 640, height: 480}}
                                    imageType = {IMAGE_TYPES.PNG}
                                    imageCompression = {0.97}
                                    isMaxResolution = {false}
                                    isImageMirror = {false}
                                    isDisplayStartCameraError = {true}
                                    sizeFactor = {1}
                                    onCameraStart = { (stream) => { this.onCameraStart(stream); } }
                                    onCameraStop = { () => { this.onCameraStop(); } }
                                />
                                {this.state.errorUploadCamera && <span style={{color: 'red'}}>{this.state.errorUploadCamera}</span>}
                            </div>
            case "file":
                return <div>
                    {
                        this.state.loadingFile
                        ? <CircularProgress />
                        : <FileUploader
                            label={this.props.label}
                            value={this.props.uploadedFile || this.props.value}
                            onChange={this.onLoadFile}
                            fileSrc={this.props.uploadedFile}
                            imageSize={this.props.imageSize}
                        />
                    }
                    {this.state.errorLoadFile && <span style={{color: 'red'}}>{this.state.errorLoadFile}</span>}
                </div>
            case "video":
                return <div>
                    {
                        this.state.loadingFile
                        ? <CircularProgress />
                        : <FileUploader
                            label={this.props.label}
                            value={this.props.uploadedFile}
                            type="video"
                            onChange={this.onLoadFile}
                            fileSrc={this.props.uploadedFile || this.props.value}
                        />
                    }
                    {this.state.errorLoadFile && <span style={{color: 'red'}}>{this.state.errorLoadFile}</span>}
                </div>
            // case "htmlEditor":
            //     // return <Editor
            //     //     initialValue={this.props.value}
            //     //     init={{
            //     //         plugins: 'link image code',
            //     //         toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
            //     //     }}
            //     //     name={this.props.name}
            //     //     onChange={e => { this.props.onChange({...e, target: {name: this.props.name, value: e.target.getContent()}}) }}
            //     // />
            //     return <MyEditor
            //         value={this.props.value}
            //         onChange={data => this.props.onChange({target: {...data, name: this.props.name}})}
            //     />
            case "options":
                return <div>
                    <TextField 
                        InputLabelProps={{
                            shrink: ["date", "datetime-local"].includes(this.props.type) || 
                                (
                                    this.props.value !== null && 
                                    this.props.value !== undefined && 
                                    this.props.value !== ""
                                )
                        }}
                        aria-owns={this.state.open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        error={this.props.error}
                        fullWidth
                        variant="outlined"
                        inputRef={el => {
                            this.props.inputRef && this.props.inputRef(el)
                            this.anchorEl = el
                        }}
                        onFocus={e => this.setState({open: true})}
                        onBlur={e => this.setState({open: false})}
                        value={this.props.value === null || this.props.value === undefined ? "" : this.props.value}
                        onChange={this.props.onChange}
                        onKeyUp={this.props.onKeyUp}
                        label={this.props.label}
                        disabled={this.props.disabled}
                        name={this.props.name}
                        key={this.props.name}
                        id={this.props.name}
                        type={this.props.type}
                        helperText={this.props.helperText || (this.props.mask === "money" ? "Clique para zerar" : null)}
                        InputProps={inputProps}
                        multiline={this.props.multiline}
                        rows={this.props.rows || 5}
                        autoComplete="off"
                    />
                    <Popper open={!!this.state.open} style={{zIndex: 4000, width: '80%', }} anchorEl={this.anchorEl} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                            <ClickAwayListener onClickAway={this.handleClose}>
                                <MenuList>
                                    {
                                        (this.props.options || [])
                                        .filter(opt => {
                                            let txt = opt.text.toString().replace(/ /g, "").toLowerCase()
                                            // txt = removeAccents(txt)
                                            let keep = true;
                                            
                                            (this.props.value || "").toLowerCase().split(" ").forEach((word) => {
                                              keep = keep && txt.indexOf(word) > -1
                                            })
                                    
                                            return keep;
                                        })
                                        .map(opt => (
                                            <MenuItem onClick={e => this.props.onChange({target: {name: this.props.name, value: opt.value}})}>{opt.text}</MenuItem>
                                        ))
                                    }
                                </MenuList>
                            </ClickAwayListener>
                            </Paper>
                        </Grow>
                        )}
                    </Popper>
                </div>
            default: 
                let inputProps = {
                    maxLength: this.props.maxLength,
                    endAdornment: this.props.endAdornment,
                    startAdornment: this.props.startAdornment,
                }

                if(this.props.mask){
                    switch(this.props.mask){
                        case "money":
                            inputProps.inputComponent = NumberFormatCustom
                        break;
                        case "phone":
                            inputProps.inputComponent = TextMaskPhone
                        break;
                        case "cpf":
                            inputProps.inputComponent = TextMaskCpf
                        break;
                        case "cnpj":
                            inputProps.inputComponent = TextMaskCnpj
                        break;
                        case "credit_card":
                            inputProps.inputComponent = TextMaskCreditCard
                        break;
                        case "credit_card_expiry":
                            inputProps.inputComponent = TextMaskCreditCardExpiry
                        break;
                        default:
                            
                    }
                }

                return <TextField 
                    InputLabelProps={{
                        shrink: ["date", "datetime-local"].includes(this.props.type) || 
                            (
                                this.props.value !== null && 
                                this.props.value !== undefined && 
                                this.props.value !== ""
                            )
                    }}
                    error={this.props.error}
                    fullWidth
                    variant="outlined"
                    style={this.props.style}
                    inputRef={this.props.inputRef}
                    value={this.props.value === null || this.props.value === undefined ? "" : this.props.value}
                    onChange={this.props.onChange}
                    onKeyUp={this.props.onKeyUp}
                    label={this.props.label}
                    disabled={this.props.disabled}
                    name={this.props.name}
                    key={this.props.name}
                    id={this.props.name}
                    type={this.props.type}
                    helperText={this.props.helperText || (this.props.mask === "money" ? "Clique para zerar" : null)}
                    InputProps={inputProps}
                    multiline={this.props.multiline}
                    rows={this.props.rows || 5}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                />
        }
    }
}

const TextMaskPhone = (props) => {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,]}
        ref={ref => {inputRef(ref ? ref.inputElement : null);}}
        placeholderChar={'\u2000'}
        // showMask
      />
    );
}

const TextMaskCep = (props) => {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/,]}
        ref={ref => {inputRef(ref ? ref.inputElement : null);}}
        placeholderChar={'\u2000'}
        // showMask
      />
    );
}

const TextMaskCpf = (props) => {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        mask={[/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, "-", /\d/, /\d/,]}
        ref={ref => {inputRef(ref ? ref.inputElement : null);}}
        // placeholderChar={'\u2000'}
        // showMask
      />
    );
}

const TextMaskCnpj = (props) => {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        mask={[/\d/, /\d/, ".", /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, "/", /\d/, /\d/,/\d/,/\d/,"-", /\d/, /\d/,]}
        ref={ref => {inputRef(ref ? ref.inputElement : null);}}
        // placeholderChar={'\u2000'}
        // showMask
      />
    );
}

const TextMaskCreditCard = (props) => {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        mask={[/\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/,/\d/,/\d/, " ", /\d/, /\d/, /\d/, /\d/]}
        ref={ref => {inputRef(ref ? ref.inputElement : null);}}
        // placeholderChar={'\u2000'}
        // showMask
      />
    );
}

const TextMaskCreditCardExpiry = (props) => {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        mask={[/\d/, /\d/, "/", /\d/, /\d/]}
        ref={ref => {inputRef(ref ? ref.inputElement : null);}}
        // placeholderChar={'\u2000'}
        // showMask
      />
    );
}

const NumberFormatCustom = (props) => {
    const { inputRef, onChange, value, ...other } = props;
    
    let handleChange = (event, maskedvalue, floatvalue) => {
        console.log(floatvalue)
        onChange({
            target: {
                name: props.name,
                value: floatvalue,
            }
        })
    }

    return <CurrencyInput 
        {...other}
        onClick={event => { onChange({target: {name: props.name, value: ""}}) }}
        getInputRef={inputRef}
        value={value === "" || value === undefined ? null : value} 
        onChangeEvent={handleChange}
        decimalSeparator=","
        thousandSeparator="."
        prefix="R$ "
        allowEmpty={true}
    />
    // return (
    //   <NumberFormat
    //     {...other}
    //     getInputRef={inputRef}
    //     onChange={e => {
    //         let value = e.target.value.toString().replace(/ |\.|\,/g, '').replace("R$", '')
    //         console.log("previous", value + " - " + e.target.value[e.target.value.length - 1])
    //         value = parseFloat(`${value.slice(0, -2)}.${`00${value}`.slice(-2)}`)
    //         console.log("after", value)

    //         onChange({
    //             target: {
    //                 name: props.name,
    //                 value: value,
    //             },
    //         });
    //     }}
    //     onValueChange={values => {
    //         // let value = values.value //.replace(/\./, '')
    //         // // let value = values.value.replace(/\.\,/, '')
    //         // // console.log("previous", values.value)
    //         // // value = parseFloat(`${value.slice(0, -2)}.${value.slice(-2)}`)
    //         // onChange({
    //         //     target: {
    //         //         name: props.name,
    //         //         value: value,
    //         //     },
    //         // });
    //     }}
    //     thousandSeparator="."
    //     decimalSeparator=","
    //     // decimalScale={2}
    //     value={value ? parseFloat(value) : null}
    //     // fixedDecimalScale
    //     prefix="R$ "
    //   />
    // );
  }

export default class InputField extends React.Component{
    render(){
        let {defaultStyle, ...other} = this.props
        return <div style={{padding: 10, ...defaultStyle}}>
            <RenderInput {...other} />
        </div>
    }
}