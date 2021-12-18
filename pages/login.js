import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
  return (
    <div className="flex flex-col items-center justify-center bg-black  min-h-screen w-full">
      <img
        className="w-52"
        src="https://links.papareact.com/9xl"
        alt="spt logo"
      />
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name} className="flex flex-col items-center">
            <button
              className="bg-green-500 mt-5 p-2 rounded-full cursor-pointer"
              onClick={() => {
                signIn(provider.id, { callbackUrl: "/" });
              }}
            >
              Login with {provider.name}
            </button>
            <p className="p-5 text-center text-xs md:text-base text-gray-500">Attention, this web app on NEXT.JS & TAILWIND.CSS is only made for studies using the spotify API itself. By the time you log in, some device logged in with your account must be active, the web app will control the music through it. For copyright reasons it is not possible to play songs directly in the webapp. Thank you. 
            - FS</p>
          </div>
        );
      })}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
