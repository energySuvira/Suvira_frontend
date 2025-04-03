import React from 'react';
import Slder from './Slder';

function PartnerSlider({ PartnerShips }) {
    return (
        <div className="w-full flex">
            {PartnerShips && PartnerShips.length > 0 ? (
                <Slder slides={PartnerShips} duration={20} />
            ) : (
                <h1 className="text-center w-full flex flex-col items-center text-red-600">
                    Partners Error
                </h1>
            )}
        </div>
    );
}

export default PartnerSlider;
