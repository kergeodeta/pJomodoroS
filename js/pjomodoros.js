$(document).ready(function() {
    // Worker elements
    var durationOfWorkSession = $('#duration-of-work-session').val() * 60;
    var durationOfShortBreak = $('#duration-of-short-break').val() * 60;
    var durationOfLongBreak = $('#duration-of-long-break').val() * 60;
    var longBreakAfter = $('#long-break-after').val();
    var dailyTartget = $('#daily-target').val();
    var performedWorkSessions = 0;
    var performedWorkSessionsBeforeLongBreak = 0;
    var elapsedTime = 0;
    var running = false;
    var eSession = {
        WORK: 1,
        SBREAK: 2,
        LBREAK: 3
    };
    var session = eSession.WORK;
    // GUI elements
    var nodeCounter = $('#counter');
    var btnStart = $('#btn-start');
    var btnPause = $('#btn-pause'); 
    var btnStop = $('#btn-stop');
    var btnSettings = $('#btn-open-settings');

    nodeCounter.text(sec2min(durationOfWorkSession));

    btnStart.click(function() {
        btnClickable(btnStart, false);
        btnClickable(btnPause, true);
        btnClickable(btnStop, true);
        btnClickable(btnSettings, false);

        running = true;
        timer();
    });

    btnPause.click(function() {
        btnClickable(btnStart, true);
        btnClickable(btnPause, false);
        btnClickable(btnStop, true);
        btnClickable(btnSettings, false);

        running = false;
    });

    btnStop.click(function() {
        btnClickable(btnStart, true);
        btnClickable(btnPause, false);
        btnClickable(btnStop, false);
        btnClickable(btnSettings, true);

        running = false;
        elapsedTime = 0;
        
        switch(session) {
            case eSession.WORK: nodeCounter.text(sec2min(durationOfWorkSession));
            break;
            case eSession.SBREAK: nodeCounter.text(sec2min(durationOfShortBreak));
            break; 
            case eSession.LBREAK: nodeCounter.text(sec2min(durationOfLongBreak));
            break;
        }
    });

    $('#btn-settings').click(function() {
        durationOfWorkSession = $('#duration-of-work-session').val() * 60;
        durationOfShortBreak = $('#duration-of-short-break').val() * 60;
        durationOfLongBreak = $('#duration-of-long-break').val() * 60;
        longBreakAfter = $('#long-break-after').val();
        dailyTartget = $('#daily-target').val();

        $('#counter').text(sec2min(durationOfWorkSession));
        $('#h-long-break-after').text('Long break after: 0/' + longBreakAfter);
        $('#h-daily-target').text('Daily target: 0/' + dailyTartget);
    });

    function sec2min(arg) {
        var min = Math.floor(arg / 60);
        var sec = arg % 60;

        if(min <= 9) min = '0' + min;
        if(sec <= 9) sec = '0' + sec;

        return min + ":" + sec;
    }

    function btnClickable(btn, clickable) {
        if(clickable) {
            btn.removeClass('disabled');
            btn.prop('disabled', false);
        } else {
            btn.addClass('disabled');
            btn.prop('disabled', true);
        }
    }

    function timer() {
        setTimeout(function() {
            if(running) {
                elapsedTime++;

                switch(session) {
                    case eSession.WORK: 
                        nodeCounter.text(sec2min(durationOfWorkSession - elapsedTime));

                        if(durationOfWorkSession - elapsedTime < 1) {
                            $.notify('Work session completed! Time to break.', 'info');

                            running = false;
                            performedWorkSessions++;
                            elapsedTime = 0;

                            if(performedWorkSessions != 0 && (performedWorkSessions % longBreakAfter == 0)) {
                                performedWorkSessionsBeforeLongBreak = 0;
                                session = eSession.LBREAK;

                                nodeCounter.text(sec2min(durationOfLongBreak));
                            } else {
                                performedWorkSessionsBeforeLongBreak++;
                                session = eSession.SBREAK;

                                nodeCounter.text(sec2min(durationOfShortBreak));
                            }

                            if(performedWorkSessions == dailyTartget) {
                                $.notify('Congratulations! You achieved your daily target!', 'success');
                            }

                            btnClickable(btnStart, true);
                            btnClickable(btnPause, false);
                            btnClickable(btnStop, false);
                            btnClickable(btnSettings, false);

                            $('#h-long-break-after').text('Long break after: ' + performedWorkSessionsBeforeLongBreak + '/' + longBreakAfter);
                            $('#h-daily-target').text('Daily target: ' + performedWorkSessions + '/' + dailyTartget);

                            document.getElementById('notification').play();
                        }
                    break;
                    case eSession.SBREAK:
                        nodeCounter.text(sec2min(durationOfShortBreak - elapsedTime));

                        if(durationOfShortBreak - elapsedTime < 1) {
                            $.notify('Short break is finished! Back to work.', 'info');

                            running = false;
                            session = eSession.WORK;
                            elapsedTime = 0;

                            nodeCounter.text(sec2min(durationOfWorkSession));

                            document.getElementById('notification').play();

                            btnClickable(btnStart, true);
                            btnClickable(btnPause, false);
                            btnClickable(btnStop, false);
                            btnClickable(btnSettings, false);
                        }
                    break;
                    case eSession.LBREAK:
                        nodeCounter.text(sec2min(durationOfLongBreak - elapsedTime));

                        if(durationOfLongBreak - elapsedTime < 1) {
                            $.notify('Long break is over! Back to work.', 'info');

                            running = false;
                            session = eSession.WORK;
                            elapsedTime = 0;

                            nodeCounter.text(sec2min(durationOfWorkSession));

                            document.getElementById('notification').play();

                            btnClickable(btnStart, true);
                            btnClickable(btnPause, false);
                            btnClickable(btnStop, false);
                            btnClickable(btnSettings, false);
                        }
                    break;
                }

                timer();
            }
        }, 1000);
    }
});