function loadCode() {
    codes = $("#codeText").val().split('\n');
}

function runOne() {

    if (codeIsLoaded == 0) {
        loadCode();
        codeIsLoaded = 1;
        PC = 0;
    }

    jQuery.globalEval(codes[PC]);
    setPC(PC + 1);
}