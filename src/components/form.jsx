export default function Form() {
    return(
        <div className="bg-white rounded-2xl w-[90%] h-[80%] relative pointer-events-auto border shadow-2xl">
            <div className="absolute z-1 w-full">
                <div className="flex justify-end mr-7 mt-5">
                    <h1 className="bg-red-600 text-white px-2 rounded-md text-center cursor-pointer hover:font-bold hover:shadow-2xl">X</h1>
                </div>
            </div>
            <div>
                <h1>Form</h1>
            </div>
        </div>
    )
}