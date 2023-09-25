import React from "react";
import SpotifyWebApi from 'spotify-web-api-js';
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Track } from "./Track";
import { Loader } from "./Loader";
import { toPng } from 'html-to-image';

const spotify = new SpotifyWebApi()

export function Generate(props) {

    const canvasRef = useRef(null)
    const [accessToken, setAccessToken] = useState(props.accessToken);
    const [topTracks, setTopTracks] = useState([]);
    const [audioAnalysis, setAudioAnalysis] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const elementRef = useRef(null);

    

    const htmlToImageConvert = () => {
        toPng(elementRef.current, { canvasWidth: 1000, canvasHeight: 790 })
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = "spotiwaves.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        spotify.setAccessToken(accessToken);

        if (accessToken) {
            setShowLoading(true);
            spotify.getMyTopTracks({ limit: 10 }).then(async res => {
                //setTopTracks(res.items);

                console.log(res.items);
                let tracks = [];
                for (let i = 0; i < res.items.length; i++) {
                    let aa = await spotify.getAudioAnalysisForTrack(res.items[i].id)
                    let newItem = {
                        id: res.items[i].id,
                        name: res.items[i].name,
                        artists: res.items[i].artists,
                        audioAnalysis: aa
                    }

                    tracks.push(newItem);
                }

                console.log("dopo il map");
                console.log(tracks);
                setTopTracks(tracks);
                setShowLoading(false);
            }

            )
        }
    }, [])

    return (
        <>

            <div className="generate-container" ref={elementRef} id="toPrint">
                {
                    !showLoading ?
                        <div className='tracks-container'>
                            <button className="download" onClick={htmlToImageConvert}><span class="material-symbols-outlined">
                                download
                            </span></button>
                            {topTracks.map(t => {
                                return <Track key={t.id} track={t} />
                            })}
                        </div>
                        :
                        <Loader></Loader>
                }
            </div>
        </>
    );
}