var session_auction, soldForPoints
function secondsTimeSpanToHMS(s) {
  var h = Math.floor(s / 3600); //Get whole hours
  s -= h * 3600;
  var m = Math.floor(s / 60); //Get remaining minutes
  s -= m * 60;
  return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
} 
function processMatchTime() {
	if(clock_data) {
		if(clock_data.matchTimeStatus.toLowerCase() == 'start') {
			clock_data.matchTotalSeconds = clock_data.matchTotalSeconds + 1;
			processAuctionProcedures('LOG_TIME',clock_data.matchTotalSeconds);
		}
		if(document.getElementById('match_time_hdr')) {
			document.getElementById('match_time_hdr').innerHTML = 'MATCH TIME : ' + 
				secondsTimeSpanToHMS(clock_data.matchTotalSeconds);
		}
	}
}
function processWaitingButtonSpinner(whatToProcess) 
{
	switch (whatToProcess) {
	case 'START_WAIT_TIMER': 
		$('.spinner-border').show();
		$(':button').prop('disabled', true);
		break;	case 'END_WAIT_TIMER': 
		$('.spinner-border').hide();
		$(':button').prop('disabled', false);
		break;
	}
}
function afterPageLoad(whichPageHasLoaded)
{
	switch (whichPageHasLoaded) {
	case 'AUCTION':
		processAuctionProcedures('LOAD_MATCH',null);
		break;
	}
}
function initialiseForm(whatToProcess, dataToProcess)
{
	switch (whatToProcess) {
	case 'TIME':
	
		break;
	case 'MATCH':
	
		break;
	}
}
function uploadFormDataToSessionObjects(whatToProcess)
{
	var formData = new FormData();
	var url_path;

	$('input, select, textarea').each(
		function(index){  
			if($(this).is("select")) {
				formData.append($(this).attr('id'),$('#' + $(this).attr('id') + ' option:selected').val());  
			} else {
				formData.append($(this).attr('id'),$(this).val());  
			}	
		}
	);
	
	url_path = 'upload_match_setup_data';
	
	$.ajax({    
		headers: {'X-CSRF-TOKEN': $('meta[name="_csrf"]').attr('content')},
        url : url_path,     
        data : formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',     
        success : function(data) {

        },    
        error : function(e) {    
       	 	console.log('Error occured in uploadFormDataToSessionObjects with error description = ' + e);     
        }    
    });		
	
}
function processUserSelection(whichInput)
{	
	switch ($(whichInput).attr('name')) {
	case 'load_scene_btn':
	  	document.initialise_form.submit();
		break;
	case 'selectedBroadcaster':
		switch ($('#selectedBroadcaster :selected').val()) {
		case 'HANDBALL':
			//$('#vizPortNumber').attr('value','1980');
			//$('label[for=vizScene], input#vizScene').hide();
			//$('label[for=which_scene], select#which_scene').hide();
			//$('label[for=which_layer], select#which_layer').hide();
			break;
		}
		break;
	case 'cancel_btn': 
		document.getElementById('select_event_div').style.display = 'none';
		processWaitingButtonSpinner('END_WAIT_TIMER');
		break;
	case 'player_overwrite_btn':
		processWaitingButtonSpinner('START_WAIT_TIMER');
		processAuctionProcedures('PLAYER_OVERWRITE',null);
		break;
	case 'refresh_player':
		processWaitingButtonSpinner('START_WAIT_TIMER');
		processAuctionProcedures('REFRESH_PLAYER',null);
		break;
	case 'player_overwrite':
		addItemsToList('LOAD_PLAYER_OVERWRITE',session_auction);
		document.getElementById('select_event_div').style.display = '';
		break;
	default:
		switch ($(whichInput).attr('id')) {
		case 'increment_btn':
			processAuctionProcedures('INCREMENT_BID',null);
			break;
		case 'decrement_btn':
			processAuctionProcedures('DECREMENT_BID',null);
			break;
		}
		break;
	}
	
}
function processAuctionProcedures(whatToProcess, whichInput)
{
	var value_to_process; 

	$.ajax({    
        type : 'Get',     
        url : 'processAuctionProcedures.html',     
        data : 'whatToProcess=' + whatToProcess + '&valueToProcess=' + value_to_process, 
        dataType : 'json',
        success : function(data) {
			session_auction = data;
        	switch(whatToProcess) {
			case 'LOAD_MATCH':
				addItemsToList('LOAD_MATCH',data);
				document.getElementById('auction_div').style.display = '';
				document.getElementById('select_event_div').style.display = 'none';
				break;
			case 'INCREMENT_BID': case 'DECREMENT_BID': case 'REFRESH_PLAYER':
				addItemsToList('LOAD_MATCH',data);
				break;
			case 'UNDO_PLAYERS':
				alert('Removed Successfully');
				addItemsToList('LOAD_MATCH',data);
				break;
			case 'PLAYER_OVERWRITE':
				addItemsToList('LOAD_PLAYER_OVERWRITE',data);
				addItemsToList('LOAD_MATCH',data);
				break;
			case 'READ-MATCH-AND-POPULATE':
				addItemsToList('SHOW_BID',data);
				break;
        	}
    		processWaitingButtonSpinner('END_WAIT_TIMER');
	    },    
	    error : function(e) {    
	  	 	console.log('Error occured in ' + whatToProcess + ' with error description = ' + e);     
	    }    
	});
}
function addItemsToList(whatToProcess, dataToProcess)
{
    switch (whatToProcess) {

  case 'SHOW_BID':
    $('#auction_div').empty();
    if (dataToProcess && dataToProcess.auction) {
        let teams = dataToProcess.auction.team || dataToProcess.auction.teams;
        let players = dataToProcess.auction.players || [];

        // ── MINIMUM THRESHOLDS ──
        const MIN_COUNTS = { ICON: 1, SENIOR: 4, EMERGING: 3, DEVELOPMENT: 5 };

        // ── COUNT SOLD PLAYERS PER TEAM PER CATEGORY ──
        function getTeamCounts(teamId) {
            let sold = players.filter(p => p.teamId === teamId && p.soldOrUnsold === 'SOLD');
            return {
                icon:        sold.filter(p => p.category === 'ICON').length,
                senior:      sold.filter(p => p.category === 'SENIOR').length,
                emerging:    sold.filter(p => p.category === 'EMERGING').length,
                development: sold.filter(p => p.category === 'DEVELOPMENT').length,
            };
        }

        // ── HELPER: cell with green (icon-active) or red (threshold-not-met) ──
        function makeCountCell(cssClass, count, min) {
            let td = $('<td>').addClass(cssClass).text(count);
            if (count >= min) {
                td.addClass('icon-active');        // your existing green class
            } else {
                td.addClass('threshold-not-met');  // new red class
            }
            return td;
        }

        // ── TABLE ──
        let table = $('<table>');

        // ── HEADER ──
        let thead = $('<thead>');
        let headerRow = $('<tr>');
        headerRow.append('<th class="col-name">Team Name</th>');
        headerRow.append('<th class="col-icon">Icon</th>');
        headerRow.append('<th class="col-senior">Senior</th>');
        headerRow.append('<th class="col-emerging">Emerging</th>');
        headerRow.append('<th class="col-dev">Development</th>');
        headerRow.append('<th class="col-slot">Slot Rem.</th>');
        headerRow.append('<th class="col-maxbid">Max Bid</th>');
        headerRow.append('<th class="col-purse">Purse</th>');
        thead.append(headerRow);

        // ── BODY ──
        let tbody = $('<tbody>');
        teams.forEach(function(team) {
            let teamName = team.teamName1 || team.teamName;
            let purse    = parseInt(team.teamTotalPurse) || 0;
            let slotRem  = team.slotRemaining || 0;
            let maxBid   = team.maxBid || 0;
            let isLowPurse = purse < 500000;

            // ── GET ACTUAL COUNTS FROM PLAYERS ARRAY ──
            let counts = getTeamCounts(team.teamId);

            let row = $('<tr>');

            // Team name cell
            let teamCell = $('<td>').addClass('team-name col-name').text(teamName);
            if (isLowPurse) teamCell.addClass('low-purse');
            row.append(teamCell);

            // Category cells — green if threshold met, red if not
            row.append(makeCountCell('col-icon',     counts.icon,        MIN_COUNTS.ICON));
            row.append(makeCountCell('col-senior',   counts.senior,      MIN_COUNTS.SENIOR));
            row.append(makeCountCell('col-emerging', counts.emerging,    MIN_COUNTS.EMERGING));
            row.append(makeCountCell('col-dev',      counts.development, MIN_COUNTS.DEVELOPMENT));

            // Remaining columns
            row.append($('<td>').addClass('col-slot').text(slotRem));
            row.append($('<td>').addClass('col-maxbid').text('₹' + maxBid.toLocaleString('en-IN')));
            row.append($('<td>').addClass('col-purse').text('₹' + purse.toLocaleString('en-IN')));

            tbody.append(row);
        });

        table.append(thead);
        table.append(tbody);
        $('#auction_div').append(table);
    }
    break;
    }
}

function removeSelectDuplicates(select_id)
{
	var this_list = {};
	$("select[id='" + select_id + "'] > option").each(function () {
	    if(this_list[this.text]) {
	        $(this).remove();
	    } else {
	        this_list[this.text] = this.value;
	    }
	});
}
function checkEmpty(inputBox,textToShow) {

	var name = $(inputBox).attr('id');
	
	document.getElementById(name + '-validation').innerHTML = '';
	document.getElementById(name + '-validation').style.display = 'none';
	$(inputBox).css('border','');
	if(document.getElementById(name).value.trim() == '') {
		$(inputBox).css('border','#E11E26 2px solid');
		document.getElementById(name + '-validation').innerHTML = textToShow + ' required';
		document.getElementById(name + '-validation').style.display = '';
		document.getElementById(name).focus({preventScroll:false});
		return false;
	}
	return true;	
}	


