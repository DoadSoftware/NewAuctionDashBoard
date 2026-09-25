var session_auction, soldForPoints

function secondsTimeSpanToHMS(s) {
  var h = Math.floor(s / 3600);
  s -= h * 3600;
  var m = Math.floor(s / 60);
  s -= m * 60;
  return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
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
		break;
	case 'END_WAIT_TIMER':
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

// ============================================================
// TEAM LOGO HELPER
// Logos live directly in: resources/flags/<CODE>.png
// <CODE> comes straight from the "TeamBadge" column in the
// Teams table (e.g. SW, ADKR, DV, DC, GG, MI) — the JSON field
// from the backend is expected to be team.teamBadge.
//
// TEAM_LOGO_MAP below is only a fallback for the rare case
// teamBadge is missing/blank on a record; keep it in sync with
// the TeamBadge column if you rely on it.
// ============================================================
var TEAM_LOGO_MAP = {
	'SHARJAH WARRIORZ': 'SW',
	'ABU DHABI KNIGHT RIDERS': 'ADKR',
	'DESERT VIPERS': 'DV',
	'DUBAI CAPITALS': 'DC',
	'GULF GIANTS': 'GG',
	'MI EMIRATES': 'MI'
};

function getTeamLogoPath(teamBadge, teamName) {
	var base = (typeof CONTEXT_PATH !== 'undefined' && CONTEXT_PATH) ? CONTEXT_PATH : '';
	if (base.length && base.charAt(base.length - 1) !== '/') base += '/';

	var code = (teamBadge || '').toString().trim();

	if (!code) {
		// fallback only if TeamBadge wasn't provided on this record
		var key = (teamName || '').toString().trim().toUpperCase().replace(/\s+/g, ' ');
		code = TEAM_LOGO_MAP[key] || key.replace(/[^A-Z0-9]/g, '');
		console.warn('Team "' + teamName + '" has no teamBadge value — falling back to guessed code: ' + code);
	}

	return base + 'resources/flags/' + code + '.png';
}

function addItemsToList(whatToProcess, dataToProcess)
{
    switch (whatToProcess) {

		case 'SHOW_BID':

		    // ============================================================
		    // CLEAR OLD DATA
		    // ============================================================

		    $('#current_bid_div').empty();
		    $('#team_table_div').empty();

		    // ============================================================
		    // CHECK AUCTION DATA
		    // ============================================================

		    if (!dataToProcess || !dataToProcess.auction) {

		        console.warn(
		            'SHOW_BID: no auction object in response',
		            dataToProcess
		        );

		        $('#team_table_div').append(
		            '<p style="color:#fff;padding:20px;">' +
		            'No auction data available.' +
		            '</p>'
		        );

		        break;
		    }

		    // ============================================================
		    // GET AUCTION DATA
		    // ============================================================

		    let auction = dataToProcess.auction;

		    let teams = auction.team || auction.teams || [];

		    let players = auction.players || [];

		    // ============================================================
		    // CURRENT BID DATA
		    // ============================================================

		    let currentBid = dataToProcess.currentBid || null;

		    if (currentBid) {

		        let bidPlayer =
		            currentBid.currentPlayers ||
		            currentBid.player ||
		            currentBid.currentPlayer ||
		            null;

		        // If player object is not directly available,
		        // find it using playerId
		        if (!bidPlayer &&
		            currentBid.playerId &&
		            players.length) {

		            bidPlayer = players.find(function(p) {

		                return String(p.playerId) ===
		                       String(currentBid.playerId);

		            });
		        }

		        if (bidPlayer) {

		            let playerName =
		                bidPlayer.full_name ||
		                bidPlayer.playerName ||
		                bidPlayer.name ||
		                (
		                    (bidPlayer.firstName || '') +
		                    ' ' +
		                    (bidPlayer.surname || '')
		                ).trim();

		            let currentBidValue =
		                bidPlayer.soldForPoints ||
		                currentBid.currentBid ||
		                currentBid.bidAmount ||
		                currentBid.bidPrice ||
		                currentBid.price ||
		                bidPlayer.basePrice ||
		                0;

		            // ====================================================
		            // CURRENT BID CARD
		            // ====================================================

		            let playerCard =
		                $('<div>')
		                    .addClass('current-bid-card');

		            // ----------------------------------------------------
		            // LEFT SIDE
		            // ----------------------------------------------------

		            let leftWrap =
		                $('<div>')
		                    .addClass('current-bid-left');

		            leftWrap.append(
		                $('<span>')
		                    .addClass('current-bid-player')
		                    .text(playerName || 'PLAYER')
		            );

		            if (bidPlayer.category) {

		                leftWrap.append(
		                    $('<span>')
		                        .addClass('current-bid-category')
		                        .text(
		                            '[ ' +
		                            bidPlayer.category +
		                            ' ]'
		                        )
		                );
		            }

		            playerCard.append(leftWrap);

		            // ----------------------------------------------------
		            // RIGHT SIDE
		            // ----------------------------------------------------

		            let rightWrap =
		                $('<div>')
		                    .addClass('current-bid-right');

		            let amountWrap =
		                $('<div>')
		                    .addClass('current-bid-amount-wrap');

		            amountWrap.append(
		                $('<span>')
		                    .addClass('current-bid-label')
		                    .text('BID')
		            );

		            if (currentBidValue) {

		                amountWrap.append(
		                    $('<span>')
		                        .addClass('current-bid-price')
		                        .text(
		                            '₹' +
		                            parseInt(
		                                currentBidValue
		                            ).toLocaleString('en-IN')
		                        )
		                );
		            }

		            rightWrap.append(amountWrap);

		            // ----------------------------------------------------
		            // STATUS
		            // ----------------------------------------------------

		            let status =
		                (
		                    bidPlayer.soldOrUnsold ||
		                    'BID'
		                ).toUpperCase();

		            let statusText =
		                status === 'SOLD'
		                    ? 'SOLD'
		                    : (
		                        status === 'UNSOLD'
		                            ? 'UNSOLD'
		                            : 'BIDDING'
		                    );

		            let statusPill =
		                $('<div>')
		                    .addClass('current-bid-status')
		                    .text(statusText);

		            if (statusText === 'SOLD') {

		                statusPill.addClass(
		                    'status-sold'
		                );
		            }

		            if (statusText === 'UNSOLD') {

		                statusPill.addClass(
		                    'status-unsold'
		                );
		            }

		            rightWrap.append(statusPill);

		            playerCard.append(rightWrap);

		            $('#current_bid_div').append(
		                playerCard
		            );

		        } else {

		            console.warn(
		                'CURRENT BID: could not resolve player object.',
		                currentBid
		            );
		        }
		    }

		    // ============================================================
		    // NO TEAMS
		    // ============================================================

		    if (!teams || !teams.length) {

		        console.warn(
		            'SHOW_BID: teams array is empty or missing',
		            auction
		        );

		        $('#team_table_div').append(
		            '<p style="color:#fff;padding:20px;">' +
		            'No teams found. Check console for auction data.' +
		            '</p>'
		        );

		        break;
		    }

		    // ============================================================
		    // MINIMUM COUNTS
		    // ============================================================

		    const MIN_COUNTS = {

		        FULL_ICC_MEMBER: 11,

		        FULL_ICC_MEMBER_AFGHANISTAN: 4,

		        FULL_ICC_MEMBER_IRELAND: 1,

		        KUWAIT: 1,

		        UAE: 4,

		        SAUDI_ARABIA: 1,

		        ASSOCIATE_MEMBERS: 1
		    };

		    // ============================================================
		    // NORMALIZE MEMBERS VALUE
		    // ============================================================

		    function normalizeMember(value) {

		        return String(value || '')
		            .trim()
		            .toUpperCase()
		            .replace(/[^A-Z ]/g, '')
		            .replace(/\s+/g, ' ')
		            .trim();
		    }

		    // ============================================================
		    // NORMALIZE NATIONALITY VALUE
		    // ============================================================

		    function normalizeNationality(value) {

		        return String(value || '')
		            .trim()
		            .toUpperCase();
		    }

		    // ============================================================
		    // GET TEAM STATS
		    // ============================================================

		    function getTeamStats(team) {

		        // --------------------------------------------------------
		        // GET PLAYERS FOR THIS TEAM
		        //
		        // Only SOLD and RETAIN players count toward the roster —
		        // UNSOLD (and anything else) never counts.
		        // --------------------------------------------------------

		        let teamPlayers = players.filter(function(p) {

		            let status =
		                String(
		                    p.soldOrUnsold || ''
		                )
		                .trim()
		                .toUpperCase();

		            return Number(p.teamId) ===
		                       Number(team.teamId)
		                   &&
		                   (
		                       status === 'SOLD' ||
		                       status === 'RETAIN'
		                   );
		        });

		        // --------------------------------------------------------
		        // COUNTERS
		        // --------------------------------------------------------

		        let counts = {

		            fullIccMember: 0,

		            fullIccAfghanistan: 0,

		            fullIccIreland: 0,

		            kuwait: 0,

		            uae: 0,

		            saudiArabia: 0,

		            associate: 0
		        };

		        // --------------------------------------------------------
		        // DYNAMIC MEMBERS COUNT
		        //
		        // This will tell us exactly which "members" value
		        // each team has.
		        // --------------------------------------------------------

		        let memberCounts = {};

		        // --------------------------------------------------------
		        // LOOP TEAM PLAYERS
		        //
		        // Reads members/nationality straight from the
		        // transactional "players" record only — no fallback to
		        // "playersList" / the master roster.
		        // --------------------------------------------------------

		        teamPlayers.forEach(function(p) {

		            let rawMember =
		                p.members;

		            let member =
		                normalizeMember(rawMember);

		            let nationality =
		                normalizeNationality(p.nationality);

		            // ----------------------------------------------------
		            // EMPTY MEMBERS
		            // ----------------------------------------------------

		            if (!member) {

		                member = 'UNKNOWN';
		            }

		            // ----------------------------------------------------
		            // DYNAMIC COUNT
		            // ----------------------------------------------------

		            if (!memberCounts[member]) {

		                memberCounts[member] = 0;
		            }

		            memberCounts[member]++;

		            // ----------------------------------------------------
		            // FIXED COUNTERS FOR TABLE
		            //
		            // NOTE: member has already been through
		            // normalizeMember(), which uppercases everything —
		            // so every comparison below MUST be all-caps
		            // ('FULL ICC MEMBER', 'ASSOCIATE MEMBERS', etc).
		            // A mixed-case string here will never match and the
		            // player will silently fall through to "Unknown".
		            // ----------------------------------------------------

		            if (member === 'FULL ICC MEMBER') {

		                counts.fullIccMember++;   // runs for EVERY Full ICC Member player,
		                                           // regardless of nationality

		                if (nationality === 'AFGHANISTAN') {
		                    counts.fullIccAfghanistan++;   // extra sub-count, only for Afghans
		                }

		                if (nationality === 'IRELAND') {
		                    counts.fullIccIreland++;       // extra sub-count, only for Irish
		                }
		            }

		            else if (
		                member === 'KUWAIT'
		            ) {

		                counts.kuwait++;
		            }

		            else if (
		                member === 'UAE'
		            ) {

		                counts.uae++;
		            }

		            else if (
		                member === 'SAUDI ARABIA'
		            ) {

		                counts.saudiArabia++;
		            }

		            else if (
		                member === 'ASSOCIATE MEMBERS'
		            ) {

		                counts.associate++;
		            }

		            else {

		                console.warn(
		                    'Unknown members value:',
		                    rawMember,
		                    'Player:',
		                    p.full_name,
		                    'Team:',
		                    team.teamName1
		                );
		            }
		        });

		        // ========================================================
		        // TOTAL MONEY SPENT
		        // ========================================================

		        let spent =
		            teamPlayers.reduce(
		                function(sum, p) {

		                    return sum +
		                        (
		                            Number(
		                                p.soldForPoints
		                            ) || 0
		                        );
		                },
		                0
		            );

		        // ========================================================
		        // TOTAL PURSE
		        // ========================================================

		        let totalPurse =
		            Number(
		                team.teamTotalPurse
		            ) || 0;

		        // ========================================================
		        // REMAINING PURSE
		        // ========================================================

		        let purseLeft =
		            totalPurse - spent;

		        // ========================================================
		        // SQUAD COUNT
		        // ========================================================

		        let squad =
		            teamPlayers.length;

		        // ========================================================
		        // RETURN
		        // ========================================================

		        return {

		            counts: counts,

		            memberCounts: memberCounts,

		            purseLeft: purseLeft,

		            squad: squad,

		            teamPlayers: teamPlayers
		        };
		    }

		    // ============================================================
		    // CONVERT TO LAKH
		    // ============================================================

		    function ConvertToLakh(value) {

		        let num =
		            Number(value) || 0;

		        let lakhs =
		            num / 100000;

		        return '₹' +
		            lakhs.toFixed(2) +
		            'L';
		    }

		    // ============================================================
		    // CREATE NORMAL COUNT CELL
		    // ============================================================

		    function makeCountCell(
		        cssClass,
		        count,
		        min
		    ) {

		        let td =
		            $('<td>')
		                .addClass(cssClass)
		                .text(count);

		        if (count >= min) {

		            td.addClass(
		                'icon-active'
		            );

		        } else {

		            td.addClass(
		                'threshold-not-met'
		            );
		        }

		        return td;
		    }

		    // ============================================================
		    // FULL ICC CELL
		    //
		    // Shows the total Full ICC Member count as the main number,
		    // and a sub-line breaking out Afghanistan (must be >= 4) and
		    // Ireland (must be >= 1) — both compulsory sub-quotas within
		    // the Full ICC Member total.
		    // ============================================================

		    function makeFullIccCell(
		        count,
		        afghanistan,
		        ireland
		    ) {

		        let td =
		            $('<td>')
		                .addClass('col-icon');

		        let main =
		            $('<div>')
		                .addClass('icc-main')
		                .text(count);

		        let sub =
		            $('<div>')
		                .addClass('icc-sub')
		                .text(
		                    'AFG ' +
		                    afghanistan +
		                    '/' +
		                    MIN_COUNTS
		                        .FULL_ICC_MEMBER_AFGHANISTAN +

		                    ' · IRE ' +
		                    ireland +
		                    '/' +
		                    MIN_COUNTS
		                        .FULL_ICC_MEMBER_IRELAND
		                );

		        td.append(main);

		        td.append(sub);

		        // --------------------------------------------------------
		        // CHECK FULL ICC REQUIREMENT
		        //
		        // Green only when ALL THREE are satisfied: total count,
		        // Afghanistan sub-quota, and Ireland sub-quota.
		        // --------------------------------------------------------

		        let met =
		            count >=
		                MIN_COUNTS
		                    .FULL_ICC_MEMBER

		            &&
		            afghanistan >=
		                MIN_COUNTS
		                    .FULL_ICC_MEMBER_AFGHANISTAN

		            &&
		            ireland >=
		                MIN_COUNTS
		                    .FULL_ICC_MEMBER_IRELAND;

		        if (met) {

		            td.addClass(
		                'icon-active'
		            );

		        } else {

		            td.addClass(
		                'threshold-not-met'
		            );
		        }

		        return td;
		    }

		    // ============================================================
		    // CREATE TABLE
		    // ============================================================

		    let table =
		        $('<table>');

		    let thead =
		        $('<thead>');

		    let headerRow =
		        $('<tr>');

		    // ------------------------------------------------------------
		    // HEADERS
		    // ------------------------------------------------------------

		    headerRow.append(
		        '<th class="col-name">TEAM</th>'
		    );

		    headerRow.append(
		        '<th class="col-icon">FULL ICC MEMBER</th>'
		    );

		    headerRow.append(
		        '<th class="col-senior">KUWAIT</th>'
		    );

		    headerRow.append(
		        '<th class="col-emerging">UAE</th>'
		    );

		    headerRow.append(
		        '<th class="col-dev">SAUDI ARABIA</th>'
		    );

		    headerRow.append(
		        '<th class="col-assoc">ASSOCIATE MEMBER</th>'
		    );

		    headerRow.append(
		        '<th class="col-purse">PURSE REM.</th>'
		    );

		    headerRow.append(
		        '<th class="col-slot">SQUAD</th>'
		    );

		    thead.append(headerRow);

		    // ============================================================
		    // TABLE BODY
		    // ============================================================

		    let tbody =
		        $('<tbody>');

		    // ============================================================
		    // LOOP TEAMS
		    // ============================================================

		    teams.forEach(function(team) {

		        let teamName =
		            team.teamName1 ||
		            team.teamName ||
		            '';

		        // --------------------------------------------------------
		        // GET TEAM STATS
		        // --------------------------------------------------------

		        let stats =
		            getTeamStats(team);

		        let counts =
		            stats.counts;

		        let purseLeft =
		            stats.purseLeft;

		        let squad =
		            stats.squad;

		        let memberCounts =
		            stats.memberCounts;

		        // --------------------------------------------------------
		        // DEBUG
		        // --------------------------------------------------------

		        console.log(
		            '========================================'
		        );

		        console.log(
		            'TEAM:',
		            teamName
		        );

		        console.log(
		            'TEAM ID:',
		            team.teamId
		        );

		        console.log(
		            'MEMBERS COUNT:',
		            memberCounts
		        );

		        console.log(
		            'PLAYERS:',
		            stats.teamPlayers
		        );

		        console.log(
		            'SQUAD:',
		            squad
		        );

		        console.log(
		            'PURSE LEFT:',
		            purseLeft
		        );

		        console.log(
		            '========================================'
		        );

		        // --------------------------------------------------------
		        // LOW PURSE
		        // --------------------------------------------------------

		        let isLowPurse =
		            purseLeft < 500000;

		        // --------------------------------------------------------
		        // CREATE ROW
		        // --------------------------------------------------------

		        let row =
		            $('<tr>');

		        // ========================================================
		        // TEAM CELL
		        // ========================================================

		        let teamCell =
		            $('<td>')
		                .addClass(
		                    'team-name col-name'
		                );

		        if (isLowPurse) {

		            teamCell.addClass(
		                'low-purse'
		            );
		        }

		        // --------------------------------------------------------
		        // TEAM LOGO
		        // --------------------------------------------------------

		        let teamBadge =
		            team.teamBadge ||
		            team.TeamBadge ||
		            team.team_badge ||
		            '';

		        let teamWrap =
		            $('<div>')
		                .addClass(
		                    'team-name-wrap'
		                );

		        let logoImg =
		            $('<img>')
		                .addClass(
		                    'team-logo'
		                )
		                .attr(
		                    'src',
		                    getTeamLogoPath(
		                        teamBadge,
		                        teamName
		                    )
		                )
		                .attr(
		                    'alt',
		                    teamName
		                )
		                .attr(
		                    'onerror',
		                    "console.warn('Team logo failed to load:', this.src);" +
		                    "this.style.display='none';" +
		                    "this.parentNode.classList.add('no-logo');"
		                );

		        teamWrap.append(
		            logoImg
		        );

		        teamWrap.append(
		            $('<span>')
		                .addClass(
		                    'team-name-text'
		                )
		                .text(
		                    teamName
		                )
		        );

		        teamCell.append(
		            teamWrap
		        );

		        row.append(
		            teamCell
		        );

		        // ========================================================
		        // MEMBERS COUNTS
		        // ========================================================

		        row.append(
		            makeFullIccCell(
		                counts.fullIccMember,
		                counts.fullIccAfghanistan,
		                counts.fullIccIreland
		            )
		        );

		        row.append(
		            makeCountCell(
		                'col-senior',
		                counts.kuwait,
		                MIN_COUNTS.KUWAIT
		            )
		        );

		        row.append(
		            makeCountCell(
		                'col-emerging',
		                counts.uae,
		                MIN_COUNTS.UAE
		            )
		        );

		        row.append(
		            makeCountCell(
		                'col-dev',
		                counts.saudiArabia,
		                MIN_COUNTS.SAUDI_ARABIA
		            )
		        );

		        row.append(
		            makeCountCell(
		                'col-assoc',
		                counts.associate,
		                MIN_COUNTS.ASSOCIATE_MEMBERS
		            )
		        );

		        // ========================================================
		        // PURSE
		        // ========================================================

		        row.append(
		            $('<td>')
		                .addClass('col-purse')
		                .text(
		                    ConvertToLakh(
		                        purseLeft
		                    )
		                )
		        );

		        // ========================================================
		        // SQUAD
		        // ========================================================

		        row.append(
		            $('<td>')
		                .addClass('col-slot')
		                .text(
		                    squad + '/18'
		                )
		        );

		        // ========================================================
		        // ADD ROW
		        // ========================================================

		        tbody.append(row);
		    });

		    // ============================================================
		    // ADD TABLE
		    // ============================================================

		    table.append(thead);

		    table.append(tbody);

		    $('#team_table_div').append(table);

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