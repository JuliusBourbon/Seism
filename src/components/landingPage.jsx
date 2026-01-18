export default function LandingPage() {
    return(
        <div className="bg-linear-to-b from-[#00165D] to-[#008CFF] h-full">
            <div className="h-screen flex flex-col">
                <div className="h-20% flex justify-between items-center px-10 mt-10 text-white">
                    <div className="flex items-center gap-20">
                        <div className="h-10 w-10 bg-white">
                            A 
                        </div>
                        <div className="flex gap-5 justify-start font-semibold">
                            <h1>Home</h1>
                            <h1>About Us</h1>
                            <h1>FAQ</h1>
                            <h1>Credit</h1>
                        </div>
                    </div>
                    <div>
                        <button>Login</button>
                    </div>
                </div>
                <div className="flex h-full text-white items-center justify-between p-10">
                    <div className="flex flex-col gap-5">
                        <div className="font-bold text-4xl">
                            <h1>Seism</h1>
                        </div>
                        <div className="text-lg">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum odio vero esse quaerat ex nostrum ratione. Officia nisi libero blanditiis mollitia hic sapiente. Error ducimus quia repudiandae rem voluptatem velit?</p>
                        </div>
                        <div>
                            <button>Get Started</button>
                        </div>
                    </div>
                    <div className="bg-white h-full w-full">
                        <h1>a</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}