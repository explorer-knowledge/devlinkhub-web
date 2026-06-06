const {emailExists } = require('../services/emailLoadService');
const {phoneExists } = require('../services/phoneLoadService');
const {isDisposable} = require('../services/disposableService');

function validateRegistrationBody(body) {
    const{ teamName , participants} = body;


    if(!teamName ){
        return 'Team Name is required';
    }

    
    const sSeen = new Set();


    for (const participant of participants){
        if(!participant.name || !participant.email || !participant.phone || !participant.college ){
            return "All participant fields are required";
        }
        const email  = participant.email.trim().toLowerCase();
        const phone = participant.phone.trim();

        if(phoneExists(phone)){
            return `Phone no Already Exists ${participant.name} `;
        }
        if(sSeen.has(phone)){
            return `Duplicate Phone no detected ${phone}`
        }
        if(isDisposable(email)){
            return `Disposable email detected ${email}`;
        }
        if(sSeen.has(email)){
            return `Duplicate email in team found ${email}`;
        }
        if(emailExists(email)){
            return `Email already exists ${email}`;
        }
        sSeen.add(email);
        sSeen.add(phone);
    }

    const leaders = participants.filter(p => p.isLeader);

    if (leaders.length !== 1) {
        return "Team must have exactly one leader";
    }

    return null; //All good

}


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = {validateRegistrationBody};