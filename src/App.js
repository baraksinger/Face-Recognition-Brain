import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation'
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm'
import Logo from './components/Logo/Logo'
import 'tachyons'
import Rank from "./components/Rank/Rank";
import Particles from 'react-particles-js';
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

const particlesOptions = {
    particles: {
        number: {
            value: 60,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
}

const initialState = {
    isSignedIn: false,
    rank: 0,
    input: 'https://samples.clarifai.com/face-det.jpg',
    boxes: [],
    route: 'signin',
    user: {
        email: '',
        id: '',
        name: '',
        password: '',
        entries: 0,
        joined: ''
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    // componentDidMount() {
    //     fetch('http://localhost:3000/')
    //     .then(response => response.json())
    //     .then(data => console.log(data))
    // }

    calculateFaceLocation = (data) => {
        const clarifaiFaces = (data.outputs[0].data.regions).map((x) => {
            return x.region_info.bounding_box;
        });
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        const boxes = [];
        clarifaiFaces.forEach(x =>
            boxes.push({
                leftCol: x.left_col * width,
                topRow: x.top_row * height,
                rightCol: width - (x.right_col * width),
                bottomRow: height - (x.bottom_row * height)
            })
        )
        return boxes;
    }

    displayFaceBox = (boxes) => {
        this.setState({boxes});
    }

    onInputChange = (event) => {
        this.setState({
            input: event.target.value
        })
    }

    onPictureSubmit = () => {
        fetch('http://localhost:3000/image', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
        .then(response => response.json())
        .then(response => {
            this.displayFaceBox(this.calculateFaceLocation(response))
            fetch('http://localhost:3000/updateRank', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: this.state.user.id
                })
            })
            .then(response => response.json())
            .then(count => {
                this.setState(
                    {
                        ...this.state,
                        user: {
                            ...this.state.user,
                            entries: count
                        }
                    })
            })
            .catch(console.log);
        })
    }

    onRouteChange = (route) => {
        if (route === 'home') {
            this.setState({isSignedIn: true})
        } else {
            this.setState(initialState);
        }
        this.setState({route})
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                password: data.password,
                entries: data.entries,
                joined: ''
            }
        })
    }

    render() {
        const {input, route, boxes, isSignedIn} = this.state;
        return (
            <div className="App">
                <Particles
                    className='particles'
                    params={particlesOptions}
                />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                {route === 'signin' && (<SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>)}
                {route === 'register' && (<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>)}
                {route === 'home' &&
                (<div>
                    <Logo/>
                    <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                    <ImageLinkForm
                        onSubmit={this.onPictureSubmit}
                        onInputChange={this.onInputChange}
                    />
                    <FaceRecognition
                        boxes={boxes}
                        input={input}
                    />
                </div>)}
            </div>
        );
    }
}

export default App;
