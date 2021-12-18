import { useSession } from "next-auth/react"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSpotify from "../hooks/useSpotify"
import useSongInfo from "../hooks/useSongInfo"
import { useState, useEffect, useCallback} from "react"
import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline"
import {debounce} from 'lodash'
import { 
    FastForwardIcon, 
    PauseIcon, 
    PlayIcon, 
    ReplayIcon, 
    RewindIcon, 
    VolumeUpIcon, 
    SwitchHorizontalIcon,
    ReplyIcon
} from '@heroicons/react/solid'



function Player() {
    const spotifyApi = useSpotify() 
    const {data:session, status} = useSession()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)
    const songInfo = useSongInfo()
 
    const fetchCurrentSong = () => {
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data?.body?.item?.id)

                spotifyApi.getMyCurrentPlaybackState().then(data => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
           
        }
       
    }
    useEffect(() => {
      if(spotifyApi.getAccessToken() && !currentTrackId){
        fetchCurrentSong()
        setVolume(50)
      }

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
          if(data?.body?.is_playing){
            setIsPlaying(true)
          }else{
            setIsPlaying(false)

          }
        })

    }, [currentTrackId, session, spotifyApi])

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing){
                spotifyApi.pause();
                setIsPlaying(false)
            }else{
                spotifyApi.play();
                setIsPlaying(true)
            }
        })
    }

    useEffect(() => {
        if(volume <= 100 && volume >= 0){
            debouncedAdjustVolume(volume)
        }

    }, [volume])

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch(err => console.log(err))
        }, 200),
        [volume]
    )
    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid-cols-3 grid text-xs md:text-base px-2 md:px-8 z-50">
            <div className="flex items-center space-x-4">
               {  songInfo &&   <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />}

                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            <div className="flex items-center justify-evenly">
                    <SwitchHorizontalIcon className="button"/>
                    <RewindIcon className="button"/>

                    {isPlaying ? 
                    <PauseIcon onClick={handlePlayPause} className="button w-8 h-8"/> : 
                    <PlayIcon onClick={handlePlayPause} className="button w-8 h-8"/>}

                    <FastForwardIcon className="button"/>
                    <ReplyIcon className="button"/>
            </div>


            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5 transform -rotate-90 md:rotate-0 mb-20 md:mb-0 absolute md:static bottom-10 -right-20">
                <VolumeDownIcon className="button"/>
                <input
                className=" md:block md:w-20 "
                type="range"
                value={volume}
                min={0}
                max={100}
                onChange={e => setVolume(Number(e.target.value))}
                />
                <VolumeUpIcon className="button"/>
            </div>
        </div>
    )
}

export default Player
