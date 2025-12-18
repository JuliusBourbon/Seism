export default function Table({onClose}){
    return(
        <div className="bg-white rounded-2xl w-[95%] h-[85%] relative pointer-events-auto shadow-2xl mt-15">
            <div className="absolute z-1 w-full">
                <div className="flex justify-end mr-7 mt-5">
                    <button onClick={onClose} className="px-2 rounded-md text-center cursor-pointer hover:font-bold hover:shadow-2xl">✕</button>
                </div>
            </div>
            <div className="w-full h-full flex flex-col justify-between items-center">
                <div className="flex mt-5 justify-center text-3xl font-semibold">
                    <h1>Table</h1>
                </div>
                <div className="w-[95%] h-[85%] mb-10 rounded-2xl shadow-[0px_2px_20px_rgba(0,0,0,0.35)]">

                </div>
            </div>
        </div>
    )
}