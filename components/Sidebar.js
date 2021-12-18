import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
  XIcon
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {useState, useEffect} from 'react'
import useSpotify from '../hooks/useSpotify'
import {useRecoilState} from 'recoil'
import {playlistIdState} from '../atoms/playlistAtom'
import {isShowingMenuState} from '../atoms/menuAtom'
function Sidebar() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession();
  const router = useRouter();
  const [playlists, setPlaylists] = useState([])
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
  const [isShowingMenu, setIsShowingMenu] = useRecoilState(isShowingMenuState)
  useEffect(() => {
    if(spotifyApi.getAccessToken()){
      spotifyApi.getUserPlaylists().then(data => {
        setPlaylists(data.body.items)
      })
    }
  }, [session, spotifyApi])
  // console.log(session);
  // useEffect(() => {
  //   console.log(playlists)
  // }, [playlists])
  return (
    <>
    
    <div className={`text-gray-500 p-5 text-sm border-r border-gray-900 h-screen overflow-auto scrollbar-hide w-4/5 bg-black md:w-1/5 fixed ${isShowingMenu ? "top-0 left-0" : "top-0 -left-full"}  md:static md:block z-30 transition-all duration-300`}>
      <div 
      onClick={() => {
        setIsShowingMenu(prev => !prev)
      }}
      className="block md:hidden bg-black border rounded-full absolute top-2 right-2 z-50 ">
        <XIcon className="w-10 h-10 text-white  "/>
      </div>
      <div className="space-y-5">
        <button
          className="flex items-center space-x-4 hover:text-white"
          onClick={() => {
            signOut();
          }}
        >
          <p>Logout</p>
        </button>
        <button className="flex items-center space-x-4 hover:text-white">
          <HomeIcon className="w-5 h-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-4 hover:text-white">
          <SearchIcon className="w-5 h-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-4 hover:text-white">
          <LibraryIcon className="w-5 h-5" />
          <p>Library</p>
        </button>

        <hr className="borde-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-4 hover:text-white">
          <PlusCircleIcon className="w-5 h-5" />
          <p>Create playlist</p>
        </button>
        <button className="flex items-center space-x-4 hover:text-white">
          <HeartIcon className="w-5 h-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-4 hover:text-white">
          <RssIcon className="w-5 h-5" />
          <p>Your episodes</p>
        </button>

        <hr className="borde-t-[0.1px] border-gray-900" />
      </div>
      {playlists?.map(playlist => {
      return <p onClick={() => setPlaylistId(playlist.id)} key={playlist.id} className={`hover:text-white cursor-pointer ${playlist.id === playlistId && 'text-white'}`}>{playlist?.name}</p> 
      })}
    </div>
    </>
  );
}

export default Sidebar;
