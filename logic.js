'use strict';
var NS = 'org.whiz.hrms';

/**
 * @param {org.whiz.hrms.applyForLeave} applyForLeave - apply for leaves
 * @transaction
 */
function applyForLeave(applyForLeave) {
	applyForLeave.applier.remainingLeaves -= applyForLeave.numberofLeaves;
 	
 	return getParticipantRegistry('org.whiz.hrms.employee')
  		.then(function (ParticipantRegistry) {
    		return ParticipantRegistry.update(applyForLeave.applier);
    });
}