const {emailExists } = require('../services/emailLoadService');
const {isDisposable} = require('../services/disposableService');

function validateRegistrationBody(body) {
    const{ teamName , participants} = body;


    if(!teamName ){
        return 'Team Name is required';
    }

    
    const emailsSeen = new Set();


    for (const participant of participants){
        if(!participant.name || !participant.email || !participant.phone || !participant.college ){
            return "All participant fields are required";
        }
        const email  = participant.email.trim().toLowerCase();
        if(isDisposable(email)){
            return "Disposable email detected";
        }
        if(emailsSeen.has(email)){
            return "Duplicate email in team found";
        }
        if(emailExists(email)){
            return "Email already exists" ;
        }
        emailsSeen.add(email);
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