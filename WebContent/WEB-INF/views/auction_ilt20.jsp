<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>

<html lang="en">

<head>

```
<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>ILT20 Auction</title>


<!-- jQuery -->
<script src="<c:url value='/webjars/jquery/3.7.1/jquery.min.js'/>"></script>

<!-- Bootstrap -->
<script src="<c:url value='/webjars/bootstrap/5.3.8/js/bootstrap.bundle.min.js'/>"></script>


<!-- Context path used by index_ilt20.js -->
<script>

    var CONTEXT_PATH = '<c:url value="/"/>';

</script>


<!-- Auction JavaScript -->
<script src="<c:url value='/resources/javascript/index_ilt20.js'/>"></script>


<!-- Bootstrap CSS -->
<link rel="stylesheet"
      href="<c:url value='/webjars/bootstrap/5.3.8/css/bootstrap.min.css'/>">


<!-- Font Awesome -->
<link rel="stylesheet"
      href="<c:url value='/webjars/font-awesome/6.7.2/css/all.min.css'/>">
```

<style>

/* ============================================================
   CUSTOM FONT
   ============================================================ */

@font-face {

    font-family: 'AgoxesGame';

    src: url('<c:url value="/resources/fonts/AgoxesGame.ttf"/>')
         format('truetype');

}


/* ============================================================
   CSS VARIABLES
   ============================================================ */

:root {

    --magenta: #C31463;

    --magenta-glow: #FF1A7A;

    --sky: #0095DA;

    --sky-glow: #00C2FF;

    --dark: #1B0A33;

    --surface: #230F42;

    --surface2: #2B1350;

    --border: #3A1B63;

    --red: #E53030;

    --red-glow: #FF4444;

    --gold: #E6B800;

    --text: #F0EEFF;

    --text-muted: #B9A6D9;

}


/* ============================================================
   RESET
   ============================================================ */

* {

    box-sizing: border-box;

    margin: 0;

    padding: 0;

}


html,
body {

    height: 100%;

}


/* ============================================================
   BODY
   ============================================================ */

body {

    background:
        radial-gradient(
            ellipse at top,
            #4A1268 0%,
            #2B0A4A 45%,
            #12051F 100%
        );

    font-family: 'Exo 2', 'Segoe UI', sans-serif;

    min-height: 100vh;

    overflow-x: hidden;

}


/* ============================================================
   BACKGROUND EFFECTS
   ============================================================ */

body::before {

    content: '';

    position: fixed;

    top: -150px;

    left: -150px;

    width: 500px;

    height: 500px;

    background:
        radial-gradient(
            circle,
            rgba(195,20,99,0.16) 0%,
            transparent 70%
        );

    pointer-events: none;

    z-index: 0;

}


body::after {

    content: '';

    position: fixed;

    bottom: -150px;

    right: -150px;

    width: 500px;

    height: 500px;

    background:
        radial-gradient(
            circle,
            rgba(0,149,218,0.14) 0%,
            transparent 70%
        );

    pointer-events: none;

    z-index: 0;

}


/* ============================================================
   PAGE WRAPPER
   ============================================================ */

.content {

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: flex-start;

    height: 100vh;

    width: 100%;

    padding: 0.6vh 3vw 2vh;

    position: relative;

    z-index: 1;

    gap: 1.4vh;

}


/* ============================================================
   PAGE HEADER
   ============================================================ */

.page-header {

    text-align: center;

    width: 100%;

}


.page-header .eyebrow {

    font-family: 'Orbitron', monospace;

    font-size: clamp(12px, 1.05vw, 15px);

    letter-spacing: 5px;

    color: var(--sky-glow);

    text-transform: uppercase;

    margin-bottom: 3px;

    opacity: 0.85;

}


.page-header h1 {

    font-family: 'Orbitron', monospace;

    font-size: clamp(25px, 2.7vw, 34px);

    font-weight: 900;

    letter-spacing: 3px;

    background:
        linear-gradient(
            135deg,
            var(--magenta-glow) 0%,
            #CC44FF 40%,
            var(--sky-glow) 100%
        );

    -webkit-background-clip: text;

    -webkit-text-fill-color: transparent;

    background-clip: text;

    text-transform: uppercase;

    line-height: 1.1;

}


.page-header .rule {

    width: 200px;

    height: 2px;

    background:
        linear-gradient(
            90deg,
            transparent,
            var(--magenta),
            #CC44FF,
            var(--sky),
            transparent
        );

    margin: 8px auto 0;

    border: none;

}


/* ============================================================
   CURRENT BID CONTAINER
   ============================================================ */

#current_bid_div {

    width: 100%;

    max-width: 1900px;

}


.current-bid-card {

    display: flex;

    align-items: center;

    justify-content: space-between;

    flex-wrap: wrap;

    gap: 20px;

    background:
        linear-gradient(
            135deg,
            rgba(195,20,99,0.16) 0%,
            rgba(0,149,218,0.14) 100%
        );

    border-radius: 22px;

    box-shadow:
        0 0 0 1px rgba(195,20,99,0.22),
        0 0 0 2px rgba(0,149,218,0.13),
        0 14px 46px rgba(0,0,0,0.5);

    padding: 3vh 3vw;

}


.current-bid-left {

    display: flex;

    align-items: baseline;

    gap: 14px;

    flex-wrap: wrap;

}


.current-bid-player {

    font-family: 'Orbitron', monospace;

    font-size: clamp(28px, 3.4vw, 44px);

    font-weight: 800;

    letter-spacing: 1.5px;

    color: #fff;

    text-transform: uppercase;

}


.current-bid-category {

    font-family: 'Exo 2', sans-serif;

    font-size: clamp(16px, 1.5vw, 22px);

    letter-spacing: 1.2px;

    color: var(--text-muted);

    text-transform: uppercase;

}


.current-bid-right {

    display: flex;

    align-items: center;

    gap: 28px;

    flex-wrap: wrap;

}


.current-bid-amount-wrap {

    display: flex;

    align-items: baseline;

    gap: 12px;

}


.current-bid-label {

    font-family: 'Orbitron', monospace;

    font-size: clamp(13px, 1.15vw, 17px);

    letter-spacing: 3px;

    color: var(--text-muted);

    text-transform: uppercase;

}


.current-bid-price {

    font-family: 'Orbitron', monospace;

    font-size: clamp(28px, 2.9vw, 40px);

    font-weight: 800;

    color: var(--magenta-glow);

    letter-spacing: 0.5px;

}


.current-bid-status {

    font-family: 'Orbitron', monospace;

    font-size: clamp(13px, 1.15vw, 16px);

    letter-spacing: 2.5px;

    text-transform: uppercase;

    padding: 12px 28px;

    border-radius: 999px;

    border: 1px solid var(--gold);

    color: var(--gold);

    background: rgba(230,184,0,0.07);

    white-space: nowrap;

}


.current-bid-status.status-sold {

    border-color: #28a745;

    color: #28a745;

    background: rgba(40,167,69,0.08);

}


.current-bid-status.status-unsold {

    border-color: var(--red-glow);

    color: var(--red-glow);

    background: rgba(229,48,48,0.08);

}


/* ============================================================
   TEAM TABLE
   ============================================================ */

#team_table_div {

    width: 100%;

    max-width: 1900px;

    flex: 1;

    margin-top: 1.6vh;

    margin-bottom: 100px;

    display: flex;

    flex-direction: column;

    background: var(--surface);

    border-radius: 20px;

    overflow: hidden;

    box-shadow:
        0 0 0 1px rgba(195,20,99,0.30),
        0 0 0 2px rgba(0,149,218,0.16),
        0 24px 70px rgba(195,20,99,0.18),
        0 24px 70px rgba(0,149,218,0.12),
        0 4px 24px rgba(0,0,0,0.55);

}


/* ============================================================
   TABLE
   ============================================================ */

table {

    width: 100%;

    height: 100%;

    border-collapse: collapse;

    table-layout: fixed;

}


tbody {

    height: 100%;

}


/* ============================================================
   COLUMN WIDTHS
   ============================================================ */

.col-name {

    width: 24%;

}


.col-icon,
.col-slot,
.col-senior,
.col-emerging,
.col-dev,
.col-assoc {

    width: 11%;

    text-align: center;

    padding: 6px;

}


.col-purse {

    width: 13%;

    text-align: center;

}


/* ============================================================
   TABLE HEADER
   ============================================================ */

th {

    background: var(--magenta);

    color: #fff;

    font-family: 'Orbitron', monospace;

    font-size: clamp(14px, 1.2vw, 17px);

    font-weight: 700;

    padding: 2.6vh 14px;

    text-transform: uppercase;

    letter-spacing: 1px;

    white-space: normal;

    word-break: break-word;

    line-height: 1.25;

    overflow: hidden;

    border-right: 1px solid rgba(255,255,255,0.12);

}


th:last-child {

    border-right: none;

}


thead {

    box-shadow: 0 4px 16px rgba(0,0,0,0.35);

}


/* ============================================================
   TABLE CELLS
   ============================================================ */

td {

    font-size: clamp(16px, 1.4vw, 20px);

    padding: 2.1vh 26px;

    color: var(--text);

    font-weight: 600;

    letter-spacing: 1px;

    text-transform: uppercase;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

    border-right: 1px solid rgba(255,255,255,0.05);

    transition: background 0.15s;

}


td:last-child {

    border-right: none;

}


tr {

    border-bottom: 1px solid var(--border);

    transition: background 0.15s;

}


tbody tr:nth-child(odd) {

    background: var(--surface);

}


tbody tr:nth-child(even) {

    background: var(--surface2);

}


tbody tr:last-child {

    border-bottom: none;

}


tbody tr:hover {

    background: rgba(0,149,218,0.10);

}


/* ============================================================
   TEAM NAME
   ============================================================ */

.team-name {

    text-align: left;

    padding-left: 22px;

}


.team-name-wrap {

    display: flex;

    align-items: center;

    gap: 14px;

}


.team-logo {

    width: 34px;

    height: 34px;

    min-width: 34px;

    object-fit: contain;

    border-radius: 8px;

    background: rgba(255,255,255,0.06);

}


.team-name-text {

    font-weight: 700;

    color: #fff;

    font-family: 'Exo 2', sans-serif;

    letter-spacing: 1.5px;

    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;

}


.team-name-wrap.no-logo {

    gap: 0;

}


/* ============================================================
   FULL ICC MEMBER CELL
   ============================================================ */

.icc-main {

    font-size: 1em;

    line-height: 1.2;

    white-space: normal;

}


.icc-sub {

    font-size: 0.55em;

    font-weight: 600;

    letter-spacing: 0.5px;

    opacity: 0.85;

    margin-top: 2px;

    white-space: normal;

    overflow: visible;

    text-overflow: clip;

}


/* ============================================================
   COUNT THRESHOLD
   ============================================================ */

.icon-active {

    background: #28a745;

    color: #fff;

    font-weight: 800;

    box-shadow: inset 4px 0 0 #00ff88;

}


/* ============================================================
   PURSE
   ============================================================ */

.col-purse {

    color: var(--sky-glow);

    font-weight: 800;

    font-family: 'Orbitron', monospace;

    font-size: clamp(15px, 1.3vw, 19px);

    letter-spacing: 0.5px;

}


/* ============================================================
   RESPONSIVE
   ============================================================ */

@media (max-width: 1000px) {

    .content {

        padding-left: 1vw;

        padding-right: 1vw;

    }

    th {

        font-size: 12px;

        padding: 15px 5px;

    }

    td {

        font-size: 13px;

        padding: 15px 5px;

    }

    .team-name {

        padding-left: 8px;

    }

    .team-name-wrap {

        gap: 7px;

    }

    .team-logo {

        width: 26px;

        height: 26px;

        min-width: 26px;

    }

}


</style>

<script>

/*
 * Poll auction data every 800 ms.
 *
 * index_ilt20.js is responsible for:
 * 1. Calling the auction endpoint.
 * 2. Reading auction.team.
 * 3. Reading auction.players.
 * 4. Counting players team-wise.
 * 5. Creating the current bid.
 * 6. Creating the team table.
 */

setInterval(function () {

    processAuctionProcedures('READ-MATCH-AND-POPULATE');

}, 800);


/*
 * Page load callback.
 */

function afterPageLoad(context) {

    console.log('Page loaded:', context);

}

</script>

</head>

<body onload="afterPageLoad('AUCTION');">

<form:form
name="auction_form"
autocomplete="off"
action="auction"
method="POST">

```
<div class="content">


    <!-- ====================================================
         PAGE HEADER
         ==================================================== -->

    <div class="page-header">

        <div class="eyebrow">
            Auction Dashboard
        </div>

        <h1>
            ILT20 League
        </h1>

        <hr class="rule">

    </div>


    <!-- ====================================================
         CURRENT BID
         
         index_ilt20.js will populate this div.
         ==================================================== -->

    <div id="current_bid_div"></div>


    <!-- ====================================================
         TEAM TABLE
         
         index_ilt20.js will populate this div.
         ==================================================== -->

    <div id="team_table_div"></div>


</div>


<!-- ========================================================
     SELECTED BROADCASTER
     ======================================================== -->

<input
    type="hidden"
    name="selectedBroadcaster"
    id="selectedBroadcaster"
    value="${session_selected_broadcaster}">
```

</form:form>

</body>

</html>
