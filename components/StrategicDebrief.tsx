
import React from 'react';
import { StrategicDebrief as StrategicDebriefType } from '../types';

interface StrategicDebriefProps {
    debrief: StrategicDebriefType;
}

export const StrategicDebrief: React.FC<StrategicDebriefProps> = ({ debrief }) => {
    return (
        <section className="bg-gradient-to-br from-base-200 to-base-300 border border-brand-secondary/30 p-6 rounded-xl shadow-2xl animate-slide-in-up">
            <h2 className="text-3xl font-bold text-content-100 mb-4 border-b-2 border-brand-secondary/50 pb-2">
                Strategic Debriefing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-content-200">
                <div className="bg-base-100/50 p-4 rounded-lg">
                    <h3 className="font-bold text-content-100 text-lg mb-1">Campaign Synopsis</h3>
                    <p>{debrief.campaignSynopsis}</p>
                </div>
                <div className="bg-base-100/50 p-4 rounded-lg">
                    <h3 className="font-bold text-content-100 text-lg mb-1">Primary Audience</h3>
                    <p>{debrief.primaryAudience}</p>
                </div>
                <div className="bg-base-100/50 p-4 rounded-lg">
                    <h3 className="font-bold text-content-100 text-lg mb-1">Competitive Angle</h3>
                    <p>{debrief.competitiveAngle}</p>
                </div>
                <div className="bg-base-100/50 p-4 rounded-lg">
                    <h3 className="font-bold text-content-100 text-lg mb-1">Key Themes</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {debrief.keyThemes.map((theme, index) => (
                            <li key={index}>{theme}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
