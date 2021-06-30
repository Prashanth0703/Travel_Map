import { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons/";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
    const myStorage = window.localStorage;
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 20.5937,
        longitude: 78.9629,
        zoom: 4,
    });
    const [pins, setPins] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [star, setStar] = useState(0);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({ ...viewport, latitude: lat, longitude: long });
    };

    const handleAddClick = (e) => {
        const [longitude, latitude] = e.lngLat;
        setNewPlace({
            lat: latitude,
            long: longitude,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPin = {
            username: currentUser,
            title,
            desc,
            rating: star,
            lat: newPlace.lat,
            long: newPlace.long,
        };
        try {
            const res = await axios.post("/pins", newPin);
            setPins([...pins, res.data]);
            setNewPlace(null);
        } catch (err) {
            console.log(err);
        }
    };
    const handleLogout = () => {
        setCurrentUser(null);
        myStorage.removeItem("user");
    };
    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get("/pins");
                setPins(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getPins();
    }, []);
    return (
        <div className="App">
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                mapStyle="mapbox://styles/prashanth0703/ckqj91mzm339v18pe2l7nsvh4"
                onDblClick={handleAddClick}
                transitionDuration="200"
            >
                {pins.map((p, ind) => (
                    <div key={p._id}>
                        <Marker
                            latitude={p.lat}
                            longitude={p.long}
                            offsetLeft={-viewport.zoom * 3.5}
                            offsetTop={-viewport.zoom * 7}
                        >
                            <Room
                                style={{
                                    color:
                                        p.username === currentUser
                                            ? "tomato"
                                            : "slateblue",
                                    fontSize: viewport.zoom * 7,
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    handleMarkerClick(p._id, p.lat, p.long)
                                }
                            />
                        </Marker>
                        {p._id === currentPlaceId && (
                            <Popup
                                latitude={p.lat}
                                longitude={p.long}
                                closeButton={true}
                                closeOnClick={false}
                                anchor="left"
                                onClose={() => setCurrentPlaceId(null)}
                            >
                                <div className="card">
                                    <label>Place</label>
                                    <h4 className="place">{p.title}</h4>
                                    <label>Review</label>
                                    <p className="desc">{p.desc}</p>
                                    <label>Rating</label>
                                    <div className="stars">
                                        {Array(p.rating).fill(
                                            <Star className="star" />
                                        )}
                                    </div>

                                    <label>Information</label>
                                    <span className="username">
                                        Created by {p.username}
                                    </span>
                                    <span className="date">
                                        {format(p.createdAt)}
                                    </span>
                                </div>
                            </Popup>
                        )}
                    </div>
                ))}
                {newPlace && (
                    <Popup
                        latitude={newPlace.lat}
                        longitude={newPlace.long}
                        closeButton={true}
                        closeOnClick={false}
                        onClose={() => setNewPlace(null)}
                        anchor="left"
                    >
                        <div>
                            <form onSubmit={handleSubmit}>
                                <label>Title</label>
                                <input
                                    placeholder="Enter a title"
                                    autoFocus
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <label>Description</label>
                                <textarea
                                    placeholder="Say us something about this place."
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                                <label>Rating</label>
                                <select
                                    onChange={(e) => setStar(e.target.value)}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <button type="submit" className="submitButton">
                                    Add Pin
                                </button>
                            </form>
                        </div>
                    </Popup>
                )}
                {currentUser ? (
                    <button className="button logout" onClick={handleLogout}>
                        Log out
                    </button>
                ) : (
                    <div className="buttons">
                        <button
                            onClick={() => setShowLogin(true)}
                            className="button login"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => setShowRegister(true)}
                            className="button register"
                        >
                            Register
                        </button>
                    </div>
                )}
                {showRegister && <Register setShowRegister={setShowRegister} />}
                {showLogin && (
                    <Login
                        setShowLogin={setShowLogin}
                        setCurrentUsername={setCurrentUser}
                        myStorage={myStorage}
                    />
                )}
            </ReactMapGL>
        </div>
    );
}

export default App;
