import { useSession,signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { UserIcon } from "@heroicons/react/outline";
import {useEffect, useState} from 'react'
import {shuffle} from 'lodash'
import {useRecoilState, useRecoilValue} from 'recoil'
import {playlistIdState, playlistState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import {ArrowCircleRightIcon, MenuIcon} from '@heroicons/react/solid'
import {isShowingMenuState} from '../atoms/menuAtom'
import Songs from './Songs'
// REMEMBER TO DO SIDBAR SLIDE FUNCION TO MOBILE SCREENS
const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-red-500',
  'from-green-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]
function Center() {
  const { data: session } = useSession();
  const [color, setColor] = useState('')
  const router = useRouter();
  const spotifyApi = useSpotify()
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)
  const [isShowingMenu, setIsShowingMenu] = useRecoilState(isShowingMenuState)
  const [error, setError] = useState(false)
  const [firstEnter, setFirstEnter] = useState(true)
  useEffect(() => {
    setColor(shuffle(colors).pop())
  },[playlistId])

  useEffect(() => {

    if(playlistId !== ''){
      spotifyApi.getPlaylist(playlistId).then((data) => {
        setPlaylist(data.body)
        setFirstEnter(false)
        setError(false)
      }).catch(e => {
        console.log('something went wrong: ' + e)
        setError(true)
      })
    }
   
  }, [spotifyApi, playlistId])

  return (
    <div className="flex-grow text-white h-screen overflow-auto scrollbar-hide w-4/5">
      <MenuIcon className="text-white md:hidden w-10 h-10 absolute top-5 left-2 " onClick={() => [
        setIsShowingMenu(prev => !prev)
      ]}/>
      <header className="absolute top-5 right-3 md:right-10 transform scale-90 md:scale-100"
    
      >
        {session ? (
          <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-70 transition-all duration-100 rounded-full p-1 pr-2 cursor-pointer border border-white">
            <img
              className="rounded-full w-10 h-10"
              src={session?.user?.image}
            />
            <h2>{session?.user?.name}</h2>
          </div>
        ) : (
          <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 transition-all duration-100 rounded-full p-1 pr-2">
            <UserIcon className="w-8 h-8" />
            <button
              onClick={() => {
                router.push("/login");
              }}
            >
              Click Here to Log in!
            </button>
          </div>
        )}
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} text-white p-8`}
      >
        {playlistId !== 'null' ? 
        <div className="flex flex-col md:flex-row items-center"> 
          <img src={playlist?.images?.[0].url} alt="" className="w-44 h-44 shadow-2xl md:mr-2"/>
          <div>
          <p>PLAYLIST</p>
          <h1 className="text-4xl font-bold">{playlist?.name}</h1>
          </div>
        </div> : 
        <div className="mt-24 lg:mt-0">
          <h1 className="flex items-center text-3xl font-bold">{session?.user?.name ? 'Select a playlist!' : "Are you new here? Try to log in!"}</h1>
        </div>
        
        }
        
        
      </section>
      {
        !error &&
        <div>
         <Songs/>
        </div>
      }
     
    </div>
  );
}

export default Center;
