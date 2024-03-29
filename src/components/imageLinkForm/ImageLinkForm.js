import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onSubmit}) => {
    return (
        <div>
            <p className='f3'>
                {'This Magic Brain will detect all faces in your pictures. Give it a try!'}
                <br></br>
                {'enter image url or try out the sample image:'}
            </p>
            <div className='center'>
                <div className='form background center pa4 br3 shadow-5'>
                    <input
                        className='center f4 pa2 w-70'
                        onChange={onInputChange}
                    />
                    <button
                        onClick={onSubmit}
                        className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                        >Detect</button>
                </div>
            </div>
        </div>

    );
}

export default ImageLinkForm;