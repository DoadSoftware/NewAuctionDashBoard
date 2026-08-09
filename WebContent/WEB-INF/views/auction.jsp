<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mumbai T20 Auction</title>

	<script src="<c:url value='/webjars/jquery/3.7.1/jquery.min.js'/>"></script>
	<script src="<c:url value='/webjars/bootstrap/5.3.8/js/bootstrap.bundle.min.js'/>"></script>
	<script src="<c:url value='/resources/javascript/index.js'/>"></script>
	
	<link rel="stylesheet" href="<c:url value='/webjars/bootstrap/5.3.8/css/bootstrap.min.css'/>"/>
	<link rel="stylesheet" href="<c:url value='/webjars/font-awesome/6.7.2/css/all.min.css'/>"/>

<style>

/* CUSTOM FONT */
@font-face {
    font-family: 'AgoxesGame';
    src: url('<c:url value="/resources/fonts/AgoxesGame.ttf"/>') format('truetype');
}

/* ── CSS VARIABLES ── */
:root {
    --magenta:      #C31463;
    --magenta-glow: #FF1A7A;
    --sky:          #0095DA;
    --sky-glow:     #00C2FF;
    --dark:         #06060F;
    --surface:      #0C0C1C;
    --surface2:     #101026;
    --border:       #1A1A30;
    --red:          #E53030;
    --red-glow:     #FF4444;
    --text:         #F0EEFF;
    --text-muted:   #8888BB;
}

/* ── RESET & BASE ── */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    background: radial-gradient(ellipse at top left, #14042A 0%, #060612 40%, #021020 100%);
    font-family: 'Exo 2', 'Segoe UI', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
}

/* ── AMBIENT GLOW BLOBS ── */
body::before {
    content: '';
    position: fixed;
    top: -150px; left: -150px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(195,20,99,0.10) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
}
body::after {
    content: '';
    position: fixed;
    bottom: -150px; right: -150px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(0,149,218,0.10) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
}

/* ── PAGE WRAPPER ── */
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding: 4px 24px 60px;
    position: relative;
    z-index: 1;
}

/* ── PAGE HEADER ── */
.page-header {
    text-align: center;
    margin-bottom: 32px;
    width: 100%;
}
.page-header .eyebrow {
    font-family: 'Orbitron', monospace;
    font-size: clamp(22px, 1vw, 13px);
    letter-spacing: 6px;
    color: var(--sky-glow);
    text-transform: uppercase;
    margin-bottom: 10px;
    opacity: 0.85;
}
.page-header h1 {
    font-family: 'Orbitron', monospace;
    font-size: clamp(22px, 3.5vw, 46px);
    font-weight: 900;
    letter-spacing: 4px;
    background: linear-gradient(135deg, var(--magenta-glow) 0%, #CC44FF 40%, var(--sky-glow) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: uppercase;
    line-height: 1.1;
}
.page-header .rule {
    width: 260px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--magenta), #CC44FF, var(--sky), transparent);
    margin: 14px auto 0;
    border: none;
}

/* ── MAIN TABLE CONTAINER ── */
#auction_div {
    width: 100%;
    max-width: 1600px;
    background: var(--surface);
    border-radius: 20px;
    overflow: hidden;
    box-shadow:
        0 0 0 1px rgba(195,20,99,0.25),
        0 0 0 2px rgba(0,149,218,0.15),
        0 24px 80px rgba(195,20,99,0.15),
        0 24px 80px rgba(0,149,218,0.12),
        0 4px 24px rgba(0,0,0,0.7);
}

/* ── TABLE ── */
table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}
/* ── TABLE ── */
table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}


.col-name {
    width: 20%;   /* bigger for team name */
}

.col-icon {
    width: 10%;
    text-align: center;
    padding: 6px;
}

.col-slot,
.col-senior,
.col-emerging,
.col-dev {
    width: 10%;
    text-align: center;
    padding: 6px;
}
.col-maxbid,
.col-purse {
    width: 15%;
    text-align: center;
}

/* ── HEADER ── */
th {
    background: linear-gradient(90deg, var(--magenta) 0%, #882299 38%, #226699 62%, var(--sky) 100%);
    color: #fff;
    font-family: 'Orbitron', monospace;
    font-size: clamp(10px, 1vw, 13px);
    font-weight: 700;
    padding: 18px 22px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-right: 1px solid rgba(255,255,255,0.08);
}
th:last-child { border-right: none; }

thead {
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

/* ── BODY CELLS ── */
td {
    font-size: clamp(12px, 1vw, 15px);
    padding: 20px 22px;
    color: var(--text);
    font-weight: 500;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-right: 1px solid rgba(255,255,255,0.04);
}
td:last-child { border-right: none; }

/* ── ROW STRIPES ── */
tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
}
tbody tr:nth-child(odd)  { background: var(--surface); }
tbody tr:nth-child(even) { background: var(--surface2); }
tbody tr:last-child      { border-bottom: none; }

/* ── TEAM NAME CELL ── */
.team-name {
    text-align: left;
    padding-left: 22px;
    font-weight: 600;
    color: #fff;
    font-family: 'Exo 2', sans-serif;
    letter-spacing: 1.8px;
}
.threshold-not-met {
    background: var(--red) !important;
    color: #fff !important;
    font-weight: 700;
    box-shadow: inset 4px 0 0 var(--red-glow);
}

/* ── LOW PURSE — SOLID RED ── */
.low-purse {
    background: var(--red) !important;
    color: #fff !important;
    font-weight: 700 !important;
    font-family: 'Orbitron', monospace !important;
    font-size: clamp(10px, 0.9vw, 13px) !important;
    letter-spacing: 2px !important;
    box-shadow: inset 4px 0 0 var(--red-glow);
}
/* ── green ── */
.icon-active {
    background: #28a745;
    color: #fff;
    font-weight: 700;
    box-shadow: inset 4px 0 0 #00ff88;
}

/* ── PURSE COLUMN ── */
td:last-child {
    color: var(--sky-glow);
    font-weight: 700;
    font-family: 'Orbitron', monospace;
    font-size: clamp(11px, 0.95vw, 14px);
    letter-spacing: 1px;
}

</style>

<script>
setInterval(() => {
    processAuctionProcedures('READ-MATCH-AND-POPULATE');
}, 800);

function afterPageLoad(context) {
    console.log('Page loaded:', context);
}
</script>

</head>

<body onload="afterPageLoad('AUCTION');">

<form:form name="auction_form" autocomplete="off" action="auction" method="POST">

    <div class="content">

        
        <div class="page-header">
            <div class="eyebrow">Auction Dashboard</div>
            <h1>Mumbai T20 League</h1>
            <hr class="rule">
        </div>

        <!-- ── TABLE CONTAINER ── -->
        <div id="auction_div"></div>

    </div>

    <input type="hidden" name="selectedBroadcaster" id="selectedBroadcaster" value="${session_selected_broadcaster}"/>

</form:form>

</body>
</html>
