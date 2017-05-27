/**
 * Created by Chauncey on 2017-05-26.
 */

var headsPoolSize = 20;
var nodesPollSize = 300;

var headsPool = [];
var freeHeadIndex = 0;
var freeHeadList = null;

var nodesPool = [];
var freeNodeIndex = 0;
var freeNodeList = null;