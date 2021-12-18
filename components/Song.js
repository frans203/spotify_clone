import {millisToMinutesAndSeconds} from '../lib/time'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSpotify from '../hooks/useSpotify'

function Song({track, index}) {
    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

    const playSong = () => {
        setIsPlaying(true)
        setCurrentTrackId(track.track.id)
        spotifyApi.play({
            uris: [track.track.uri]
        })
    }
    return (
        <div className={`grid grid-cols-2 cursor-pointer hover:bg-gray-900 mx-2 rounded-lg ${track.track.id === currentTrackId && "text-green-500"}`} onClick={playSong}>
            <div className='flex items-center space-x-4'>
                <div className={`items-center flex justify-center p-4 ${(index < 9) ? 'mr-2' : ''}`}>
                   <p>{index + 1}</p> 
                </div>
                <img className="w-10 h-10" src={track.track.album.images[0].url}/>
                <div>
                    <p>{track.track.name}</p>
                    <p className="text-gray-600">{track.track.artists[0].name}</p>
                </div>
            </div>

            <div className="text-gray-500 flex items-center justify-between ml-auto md:ml-0 mx-2">
                <p className="hidden md:inline">{track.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song
