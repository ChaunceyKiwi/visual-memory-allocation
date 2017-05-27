/**
 * Created by Chauncey on 2017-05-26.
 */

var i;

for (i = 0; i < headsPoolSize; i++) {
    var head = document.createElement('div');
    head.className = 'heads';
    head.id = 'head'+i;
    document.getElementById('headsPool').appendChild(head);
}

for (i = 0; i < nodesPollSize; i++) {
    var node = document.createElement('div');
    node.className = 'nodes';
    node.id = 'node'+i;
    document.getElementById('nodesPool').appendChild(node);
}

// status = 1 when being used, otherwise 0
function setHeadStatus(id, status) {
    if (status == 1) {
        document.getElementById('head'+id).className = 'heads beingUsed';
    } else {
        document.getElementById('head'+id).className = 'heads';
    }
}

// status = 1 when being used, otherwise 0
function setNodeStatus(id, status) {
    if (status == 1) {
        document.getElementById('node'+id).className = 'nodes beingUsed';
    } else {
        document.getElementById('node'+id).className = 'nodes';
    }
}