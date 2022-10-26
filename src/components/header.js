export function Header () {
    return (
        <div className=" px-10 md:px-10 sm:px-2 relative mb-5">
            <div className="bg-white px-5 py-3 rounded w-full text-left">
                <h4 className="text-purple-700 flex sm:text-sm md:text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                    </svg>
                    <span className="ml-3">Accu Weather</span>
                </h4>
            </div>
        </div>
      );
}