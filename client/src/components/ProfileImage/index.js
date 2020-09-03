import React, { Component } from 'react'
import { Storage } from "aws-amplify";
import "./profileImage.css"

export default class index extends Component {
    state = {
        selectedFile: '',
        imagePreviewUrl: '',
        selectedFileName: 'Choose file',
        displayUploadButton: false
    }

    handleImageUpload = async (event) => {
        event.preventDefault();
        // save image in S3
        event.target.textContent = 'Successfully uploaded';
        event.target.disabled = true;
        await Storage.put(this.state.selectedFileName, this.state.selectedFile);
        console.log('successfully saved file...');
        console.log('handle uploading-', this.state.selectedFile);
    }

    //test for S3//
    saveFile = async () => {
        // const { file } = this.state;
        await Storage.put('test3.txt', 'hello');
        console.log('successfully saved file...');
    };

    handleImageChange = (event) => {
        event.preventDefault();

        let reader = new FileReader();
        let file = event.target.files[0];
        console.log(reader)

        reader.onloadend = () => {
            this.setState({
                selectedFile: file,
                selectedFileName: file.name,
                imagePreviewUrl: reader.result,
                displayUploadButton: true
            });
        }

        reader.readAsDataURL(file)
    }



    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img className="profile-img-update" src={imagePreviewUrl} />);
        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }
        return (
            <>
                {/* <div className="row justify-content-center">
                    <p className="font-italic text-center">
                        The image will be uploaded here
									</p>
                    <div className="image-area mt-4">
                        <img
                            id="imageResult"
                            src={this.state.imagePreviewUrl}
                            alt=""
                            className="img-fluid rounded shadow-sm mx-auto d-block"
                        />
                    </div>
                </div> */}
                <div className="previewComponent">
                    <div className="imgPreview">
                        {$imagePreview}
                    </div>
                    <div className="row justify-content-center mt-5">

                        <div className="input-group mb-3 px-2 py-2 rounded-pill bg-white shadow-sm">
                            <input
                                id="upload"
                                type="file"
                                onChange={this.handleImageChange}
                                className="form-control border-0"
                            />
                            <label
                                id="upload-label"
                                htmlFor="upload"
                                className="font-weight-light text-muted"
                            >
                                {this.state.selectedFileName}
                            </label>
                            <div className="input-group-append">
                                <label
                                    htmlFor="upload"
                                    className="btn btn-secondary m-0 rounded-pill px-2"
                                >
                                    {' '}
                                    <i className="fa fa-cloud-upload mr-1 text-white" />
                                    <small className="text-uppercase font-weight-bold text-white">
                                        Choose file
								</small>
                                </label>
                            </div>
                        </div>

                    </div>
                    <div
                        className="row justify-content-center mt-2 "
                        style={{ display: this.state.displayUploadButton ? 'block' : 'none' }}
                    >
                        <button onClick={this.handleImageUpload}>Upload</button>
                    </div>
                </div>
            </>
        )
    }
}
