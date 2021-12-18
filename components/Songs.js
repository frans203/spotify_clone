import {useRecoilValue} from 'recoil'
import {playlistState} from '../atoms/playlistAtom'
import Song from './Song'
function Songs() {
    const playlist = useRecoilValue(playlistState)
    return (
        <div>
            {playlist?.tracks?.items.map((track, i) => {
               return <Song key={track.track.id} index={i} track={track}/>
            })}
        </div>
    )
}

export default Songs
