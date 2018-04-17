'use strict';
var NS = 'org.whiz.hrms';

/**
 * @param {org.whiz.hrms.applyForLeave} applyForLeave - apply for leaves
 * @transaction
 */
function applyForLeave(createLeaveRequest) {
  var id = Math.random().toString(36).substring(3);
  var newRequest = getFactory().newResource(NS, 'LeaveRequestsList', id);
  newRequest.applierId = createLeaveRequest.applier.id;
  newRequest.appliedDate = createLeaveRequest.leaveDate;
  newRequest.Count = createLeaveRequest.numberOfLeaves;
  //newRequest.assetId = "LeaveReq1001";
  newRequest.requestStatus = "Leave request with id  " + id + "  not yet approved";
  createLeaveRequest.applier.employeeRequestStatus = newRequest.requestStatus;

  return getAssetRegistry(NS + '.LeaveRequestsList').then(function(requestsListRegistry) {
    return requestsListRegistry.add(newRequest);
  }).then(function() {
  	return getParticipantRegistry(NS + '.employee');
    }).then(function(employeeRegistry) {
    	return employeeRegistry.update(createLeaveRequest.applier);
  });
}

/**
 * @param {org.whiz.hrms.approveLeave} approveLeave - apply for leaves
 * @transaction
 */
function approveLeave(approveLeave) {

    approveLeave.applier.remainingLeaves -= approveLeave.createRequest.Count || 23;
    approveLeave.createRequest.requestStatus = "Leave request with id  " + approveLeave.createRequest.requestId + "  Approved";
    approveLeave.applier.employeeRequestStatus = approveLeave.createRequest.requestStatus;

    return getAssetRegistry(NS + '.LeaveRequestsList').then(function(approveLeaveRegistry) {
    	return approveLeaveRegistry.update(approveLeave.createRequest);
    }).then(function() {
  	return getParticipantRegistry('org.whiz.hrms.employee');
    }).then(function(applierRegistry) {
    	return applierRegistry.update(approveLeave.applier);
  });
}

/**
 * @param {org.whiz.hrms.issueAsset} issueAsset - Issue Asset
 * @transaction
 */
function issueAsset(addAsset) {
  var id= Math.random().toString(36).substring(3);
  var newAssetRequest = getFactory().newResource(NS, 'Assets', id);
  newAssetRequest.assetName = addAsset.assetName;
  newAssetRequest.assetCount = addAsset.assetCount;
  newAssetRequest.priority = addAsset.priority;
  newAssetRequest.description = addAsset.description;
  newAssetRequest.requestId = Math.random().toString(36).substring(3);
  newAssetRequest.issuer = addAsset.issuer;
  newAssetRequest.requestStatus = "Asset with ID  " + id + "  Requested";
  addAsset.issuer.employeeRequestStatus = newAssetRequest.requestStatus;
  newAssetRequest.issuer.assets.push(newAssetRequest);

  return getAssetRegistry(NS + '.Assets').then(function(requestsListRegistry) {
    return requestsListRegistry.add(newAssetRequest);
  }).then(function() {
  return getParticipantRegistry(NS + '.employee')}).then(function(employeeRegistry) {
    return employeeRegistry.update(addAsset.issuer);
  });
}

/**
 * @param {org.whiz.hrms.allotAsset} allotAsset - Allocate Asset
 * @transaction
 */
function allotAsset(allotAsset) {
  allotAsset.owner.employeeRequestStatus = "Asset with ID  " + allotAsset.assets.assetID + "  Allotted";
  allotAsset.assets.requestStatus = allotAsset.owner.employeeRequestStatus;

  /*var newAsset = getFactory().newResource(NS, 'Assets', Math.random().toString(36).substring(3));
  newAsset.assetId = allotAsset.assets.assetID;
  newAsset.assetName = globalAsset.assets.assetName;
  newAsset.assetCount = globalAsset.assets.assetCount;
  newAsset.applierId = allotAsset.owner.id;
  newAsset.requestId = allotAsset.createRequest.requestId;
  newAsset.requestStatus = "Asset Alloted";
  allotAsset.owner.employeeRequestStatus = newAsset.requestStatus;*/

  /*if(!newAsset.owner.assets) {
  	newAsset.owner.assets = [];
  }*/
  //newAsset.owner.assets.push(newAsset);

  return getAssetRegistry(NS + '.Assets').then(function(AssetRegistry) {
    return AssetRegistry.update(allotAsset.assets);
  }).then(function() {
    return getParticipantRegistry(NS + '.employee');
  }).then(function(employeeRegistry) {
    return employeeRegistry.update(allotAsset.owner);
  });
}

