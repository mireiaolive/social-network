import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Audio from "./audio";

export default function FindPeople() {
    // console.log("properties from parent:", props);
    //call useState once for every state property you want your component to use
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState();
    const [results, setResults] = useState();
    //console.log("see users: ", users);
    //to mount component you will need to use useEffect
    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/api/findpeople");
            setUsers(data.users);
        })();
    }, []);

    useEffect(() => {
        let abort;
        (async () => {
            const { data } = await axios.get(`/api/findpeople/${searchTerm}`);
            if (!abort) {
                //console.log("see data: ", data);
                setResults(data.searchTerm);
            }
        })();
        return () => {
            abort = true;
        };
    }, [searchTerm]);

    //Rendering will involve converting an array of user objects into elements, done with map
    return (
        <div className="main-container">
            <div className="search-input">
                <p>See what happened recently</p>
                <input
                    placeholder="search"
                    type="text"
                    name="find-input"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="results-box">
                <p className="title-search">New users</p>
                {!searchTerm &&
                    users.map((user) => (
                        <div key={user.id}>
                            <div className="box">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="img-box"
                                        src={user.imageurl}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="results-box">
                {searchTerm &&
                    results.map((user) => (
                        <div key={user.id}>
                            <div className="box">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="img-box"
                                        src={user.imageurl}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>
            <p className="title-search">New music</p>
            <Audio />
        </div>
    );
}
