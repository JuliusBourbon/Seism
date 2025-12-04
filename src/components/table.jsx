export default function Table({onClose}){
    return(
        <div className="bg-white rounded-lg w-[90%] h-[80%] relative pointer-events-auto border shadow-2xl">
            <div className="absolute z-1 w-full">
                <div className="flex justify-end mr-7 mt-5">
                    <h1 onClick={onClose} className="px-2 rounded-md text-center cursor-pointer hover:font-bold hover:shadow-2xl">X</h1>
                </div>
            </div>
            <div>
                <h1>Table</h1>
            </div>
        </div>
    )
}