"use strict";

var game = {
	data : {
		money : new Decimal(0),
		unemployed : new Decimal(0),
		upgrades : {
			you : {
				mining : new Decimal(0),
				intimidation : new Decimal(0)
			},
			ores : {
				copper : {
					storage : new Decimal(0)
				},
				tin : {
					storage : new Decimal(0)
				},
				iron : {
					storage : new Decimal(0)
				}
			},
			places : {
				//TODO remember to add sabotaged amt here for saving
			}
		},
		control : {
			currentlyMining : "",
			currentlyConvincing : "",
			controlAmount : 1
		},
		player : {
			you : {
				name : "You",
				mining : {
					strength : new Decimal(1),
					modifier : new Decimal(1.1),
					cost : new Decimal(10),
					increase : new Decimal(1.15)
				},
				intimidation : {
					strength : new Decimal(1),
					modifier : new Decimal(1.1),
					cost : new Decimal(10),
					increase : new Decimal(1.15)
				}
			}
		},
		manpower : {
			worker : {
				name: "Worker",
				owned : new Decimal(0),
				max : new Decimal(0)
			}
		},
		ores : {
			copper : {
				name : "Copper",
				veinSize : new Decimal(1),
				owned : new Decimal(0),
				max : new Decimal(10),
				worth : new Decimal(0.5),
				strength : new Decimal(1000),
				progress : new Decimal(0),
				workers : new Decimal(0),
				workerCost : new Decimal(0.2),
				storageStarting : new Decimal(10),
				storageModifier : new Decimal(2),
				storageCost : new Decimal(10),
				storageCostModifier : new Decimal(1.1)
			},
			tin : {
				name : "Tin",
				veinSize : new Decimal(1),
				owned : new Decimal(0),
				max : new Decimal(10),
				worth : new Decimal(250),
				strength : new Decimal(800000),
				progress : new Decimal(0),
				workers : new Decimal(0),
				workerCost : new Decimal(10),
				storageStarting : new Decimal(10),
				storageModifier : new Decimal(2),
				storageCost : new Decimal(100),
				storageCostModifier : new Decimal(1.1)
			},
			iron : {
				name : "Iron",
				veinSize : new Decimal(1),
				owned : new Decimal(0),
				max : new Decimal(10),
				worth : new Decimal(1500),
				strength : new Decimal(8000000),
				progress : new Decimal(0),
				workers : new Decimal(0),
				workerCost : new Decimal(800),
				storageStarting : new Decimal(10),
				storageModifier : new Decimal(2),
				storageCost : new Decimal(1000),
				storageCostModifier : new Decimal(1.1)
			}
		},
		places : {
			village : {
				name : "Village",
				businesses : {
					oldShack : {
						name : "Old Shack",
						workers : new Decimal(6),
						workersMax : new Decimal(6),
						workersStep : new Decimal(1),
						strength : new Decimal(10000),
						progress : new Decimal(0)
					},
					johnsRanch : {
						name : "John's Ranch",
						workers : new Decimal(64),
						workersMax : new Decimal(64),
						workersStep : new Decimal(4),
						strength : new Decimal(100000),
						progress : new Decimal(0)
					},
					walmart : {
						name : "Walmart",
						workers : new Decimal(180),
						workersMax : new Decimal(180),
						workersStep : new Decimal(18),
						strength : new Decimal(700000),
						progress : new Decimal(0)
					},
					hiddenLaboratory : {
						name : "Hidden Laboratory",
						workers : new Decimal(1680),
						workersMax : new Decimal(1680),
						workersStep : new Decimal(42),
						strength : new Decimal(4000000),
						progress : new Decimal(0)
					},
					zion : {
						name : "Zion",
						workers : new Decimal(28980),
						workersMax : new Decimal(28980),
						workersStep : new Decimal(420),
						strength : new Decimal(20000000),
						progress : new Decimal(0)
					}
				}
			}
		},
		drills : {
			
		}
	},
	other : {
		debug : {
			frameTime : 100,
			coordinatorTimeout : null,
		},
		suffixes : ['', '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'V', 'Uv', 'Dv', 'Tv', 'Qav', 'Qiv', 'Sxv', 'Spv', 'Ov', 'Nv', 'Tt']
	}
}

initialize();

function initialize() {
	var menuOre = document.getElementById("menu_ore_list");
	
	menuOre.innerHTML += '<div class="ore-list-section-title">Manpower</div>';
	
	menuOre.innerHTML += '<div id="item_manpower_you" class="item-ore">' +
	'<span id="item_select_you" class="item-ore-text">' + game.data.player.you.name + '</span>' +
	'<div id="item_btn_upgrade_mining" class="btn btn-mine">Mining (+)</div>' +
	'<div class="progress"><span id="item_you_mining" class="progress-text">' + prettify(game.data.player.you.mining.strength) + 'x</span></div>' +
	'<div id="item_btn_upgrade_intimidation" class="btn btn-mine">Sabotage (+)</div>' +
	'<div class="progress"><span id="item_you_intimidation" class="progress-text">' + prettify(game.data.player.you.intimidation.strength) + 'x</span></div>' +
	'</div>';
	
	menuOre.innerHTML += '<div id="item_manpower_worker" class="item-ore">' +
	'<span id="item_select_worker" class="item-ore-text">' + game.data.manpower.worker.name + '</span>' +
	'<div id="item_btn_hire_worker" class="btn btn-mine">Hire</div>' +
	'<div class="progress"><div id="item_manpower_progress_worker" class="progress-bar" role="progressbar" style="width:0%"></div>' +
	'<span id="item_manpower_amount_worker" class="progress-text">' + prettify(game.data.manpower.worker.owned) + '/' + prettify(game.data.manpower.worker.max) + '</span></div>' +
	'<div id="item_btn_fire_worker" class="btn btn-mine">Fire</div></div>';
	
	menuOre.innerHTML += '<div class="ore-list-section-title">Ore</div>';
	
	var initializeOre = function(name) {
		menuOre.innerHTML += '<div id="item_ore_' + name + '" class="item-ore">' + 
		'<span id="item_select_' + ore + '" class="item-ore-text">' + game.data.ores[name].name + '<span class="item-ore-workers">Workers: <span id="item_ore_workers_' + name + '">0</span></span></span>' +
		'<div id="item_btn_mine_' + name + '" class="btn btn-mine">Mine</div>' +
		'<div class="progress"><div id="item_ore_progress_' + name + '" class="progress-bar progress-color-' + name + '" role="progressbar" style="width:0%"></div>' +
		'<span id="item_ore_amount_' + name + '" class="progress-text">' + prettify(game.data.ores[name].owned) + '/' + prettify(game.data.ores[name].max) + '</span></div>' +
		'<div id="item_btn_sell_' + name + '" class="btn btn-mine">Sell</div><div class="progress">' +
		'<div id="item_ore_progress_secondary_' + name + '" class="progress-bar" role="progressbar" style="width:0%"></div>' +
		'<span id="item_ore_amount_secondary_' + name + '" class="progress-text">0%</span></div></div>';
	}
	
	var menuPlaces = document.getElementById("menu_right_wrapper");
	
	menuPlaces.innerHTML += '<div class="ore-list-section-title">' + game.data.places.village.name + '</div>';
	
	var initializePlaces = function(name) {
		var business = game.data.places.village.businesses[name];
		
		menuPlaces.innerHTML += '<div id="item_place_' + name + '" class="item-business">' +
		'<div class="progress item-business-progress"><div id="item_business_progress_' + name + '" class="progress-bar" role="progressbar" style="width:0%"></div></div>' +
		'<div id="item_btn_convince_' + name + '" class="btn btn-convince btn-color-green">Sabotage</div>' +
		'<div class="item-business-name">' + business.name + '</div>' +
		'<div class="item-business-name">Workers: <span id="item_business_workers_' + name + '">' + business.workers + '</span>/<span id="item_business_workers_max_' + name + '">' + business.workersMax + '</span></div>' +
		'</div>';
	}
	
	
	for(var ore in game.data.ores) {
		initializeOre(ore);
	}
	for(var business in game.data.places.village.businesses) {
		initializePlaces(business);
	}
	
	document.getElementById("item_btn_upgrade_mining").onclick = function(){upgradePlayer("mining", game.data.control.controlAmount, true);};
	document.getElementById("item_btn_upgrade_intimidation").onclick = function(){upgradePlayer("intimidation", game.data.control.controlAmount, true);};
	
	for(var ore in game.data.ores) {
		document.getElementById("item_btn_mine_" + ore).onclick = (function(a){return function(){workOre(a);};})(ore);
		document.getElementById("item_btn_sell_" + ore).onclick = (function(a){return function(){sellOre(a, game.data.control.controlAmount);refreshOreAmount(a);};})(ore);
		document.getElementById("item_select_" + ore).onclick = (function(a){return function(){selectOre(a);};})(ore);
	}
	document.getElementById("item_btn_hire_worker").onclick = (function(){return function(){hireManpower("worker", game.data.control.controlAmount, true);refreshManpowerAmount("worker");};})();
	document.getElementById("item_btn_fire_worker").onclick = (function(){return function(){fireManpower("worker", game.data.control.controlAmount);refreshManpowerAmount("worker");};})();
	document.getElementById("item_select_worker").onclick = function(){};
	for(var business in game.data.places.village.businesses) {
		document.getElementById("item_btn_convince_" + business).onclick = (function(a){return function(){convinceBusiness("village", a);};})(business);
	}
	
	activeLoopCoordinator();
	selectControlAmount(1);
	refreshMoney();
	refreshUnemployed();
	
	message("I am a sentient chat log who's going to take over the world!", "Dev");
	message("*realizes it's just a div full of spans*", "Dev");
	message("Nooooooooooooooooo!", "Dev");
}

function activeLoopCoordinator() {
	var now = Date.now();
	gameLoop(game.other.debug.frameTime, true);
	
	game.other.debug.coordinatorTimeout = setTimeout(activeLoopCoordinator, game.other.debug.frameTime);
	document.getElementById("header_frame_time").innerHTML = Date.now() - now;
}

function gameLoop(frameTime, isActive) {
	for(var name in game.data.ores) {
		var ore = game.data.ores[name];
		
		if(ore.owned.lt(ore.max)) {
			if(game.data.control.currentlyConvincing == "" && game.data.control.currentlyMining == name)
				ore.progress = ore.progress.plus(game.data.player.you.mining.strength.mul(frameTime));

			if(ore.workers.gt(0))
				ore.progress = ore.progress.plus(ore.workers.mul(50));
			
			if(ore.progress.gte(ore.strength)) {
				addOre(name, ore.veinSize);
				if(ore.max.equals(ore.owned))
					ore.progress = new Decimal(0);
				else {
					ore.progress = ore.progress.minus(ore.strength);
					if(ore.progress.gte(ore.strength))
						ore.progress = new Decimal(0);
				}
			}
		}
		
		if(isActive) {
			refreshOreAmount(name);
			refreshOreWorkerAmount(name);
			refreshProgressForOre(name);
		}
	}
	
	for(var name in game.data.places.village.businesses) {
		var business = game.data.places.village.businesses[name];
		
		if(game.data.control.currentlyConvincing == name) {
			if(business.workers.gt(0)) {
				business.progress = business.progress.plus(game.data.player.you.intimidation.strength.mul(frameTime));
			
				if(business.progress.gte(business.strength)) {
					business.progress = new Decimal(0);
					convinceBusiness("village", name);
					business.workers = business.workers.minus(business.workersStep);
					game.data.unemployed = game.data.unemployed.plus(business.workersStep);
				}
			}
		}
		
		if(isActive) {
			refreshBusinessAmount("village", name);
			refreshProgressForConvince("village", name);
		}
	}
	
	if(isActive) {
		refreshPlayerAmount();
		refreshManpowerAmount("worker");
		refreshMoney();
		refreshUnemployed();
	}
}

function upgradePlayer(what, amount, isActive) {
	var upgrade = game.data.upgrades.you[what];
	var stat = game.data.player.you[what];
	
	var cost = stat.increase.pow(upgrade.plus(amount)).mul(stat.cost).minus(stat.increase.pow(upgrade).mul(stat.cost));

	if(game.data.money.gte(cost)) {
		game.data.money = game.data.money.minus(cost);
		game.data.upgrades.you[what] = upgrade.plus(amount);
		game.data.player.you[what].strength = new Decimal(stat.modifier.pow(game.data.upgrades.you[what]));
	}
	else {
		if(isActive)
			message("Can't afford " + game.data.control.controlAmount + " " + what + " upgrade. Needed: " + cost.toFixed(2) + ".", "Warning");
	}
}
//TODO refactor data structure to have upgrades so this copy paste function isn't a thing
function upgradeOreStorage(name, amount, isActive) {
	var upgrade = game.data.upgrades.ores[name].storage;
	var stat = game.data.ores[name];
	//console.log(upgrade);
	
	var cost = stat.storageCostModifier.pow(upgrade.plus(amount)).mul(stat.storageCost).minus(stat.storageCostModifier.pow(upgrade).mul(stat.storageCost)).mul(stat.storageCost);
	if(game.data.money.gte(cost)) {
		game.data.money = game.data.money.minus(cost);
		game.data.upgrades.ores[name].storage = upgrade.plus(amount);
		game.data.ores[name].max = new Decimal(stat.storageModifier.pow(game.data.upgrades.ores[name].storage).mul(stat.storageStarting));
	}
	else {
		if(isActive)
			message("Can't afford " + game.data.control.controlAmount + " " + name + " storage upgrade. Needed: " + cost.toFixed(2) + ".", "Warning");
	}
}

function workOre(name) {
	if(game.data.control.currentlyMining == name)
		return;
	
	var itemOreBtnPrev = document.getElementById("item_btn_mine_" + game.data.control.currentlyMining);
	var itemOreBtnCur = document.getElementById("item_btn_mine_" + name);
	
	game.data.control.currentlyMining = name;
	
	addClass("disabled", itemOreBtnCur);
	removeClass("disabled", itemOreBtnPrev);
}

function convinceBusiness(place, name) {
	var business = game.data.places[place].businesses[name];
	
	if(business) {
		var itemBusinessBtnPrev = document.getElementById("item_btn_convince_" + game.data.control.currentlyConvincing);
		var itemBusinessBtnCur = document.getElementById("item_btn_convince_" + name);
		
		if(game.data.control.currentlyConvincing == name) {
			game.data.control.currentlyConvincing = "";
			swapClass("btn-color-", "btn-color-green", itemBusinessBtnCur);
			itemBusinessBtnCur.innerHTML = "Sabotage";
		}
		else {
			game.data.control.currentlyConvincing = name;
			swapClass("btn-color-", "btn-color-red", itemBusinessBtnCur);
			itemBusinessBtnCur.innerHTML = "Cancel";
			if(itemBusinessBtnPrev) {
				swapClass("btn-color-", "btn-color-green", itemBusinessBtnPrev);
				itemBusinessBtnPrev.innerHTML = "Sabotage";
			}
		}
	}
}

function selectOre(name) {
	var menu = document.getElementById("menu_center_wrapper");
	
	menu.innerHTML = '<div id="desc_item_title">' + game.data.ores[name].name + '</div>' +
	'<div class="desc-item-heading">Workers</div>' +
	'<div id="desc_btn_hire" class="btn btn-desc-half btn-color-green">Hire</div>' +
	'<div id="desc_btn_fire" class="btn btn-desc-half btn-color-red">Fire</div>' +
	'<div id="desc_btn_upgrade_storage" class="btn btn-desc-full btn-color-green">Upgrade storage</div>';
	
	document.getElementById("desc_btn_hire").onclick = function(){hireWorkerToOre(name, game.data.control.controlAmount, true);refreshOreWorkerAmount(name);};
	document.getElementById("desc_btn_fire").onclick = function(){fireWorkerFromOre(name, game.data.control.controlAmount, true);refreshOreWorkerAmount(name);};
	document.getElementById("desc_btn_upgrade_storage").onclick = function(){upgradeOreStorage(name, game.data.control.controlAmount, true);refreshOreAmount(name);};
}

function hireWorkerToOre(name, amount, isActive) {
	var worker = game.data.manpower.worker;
	var ore = game.data.ores[name];
	
	var calcAmt = 0;
	
	if(worker.owned.gt(amount)) {
		calcAmt = new Decimal(amount);
	}
	else if(worker.owned.gt(0)) {
		calcAmt = worker.owned;
	}
	
	if(calcAmt.gt(0)) {
		worker.owned = worker.owned.minus(calcAmt);
		ore.workers = ore.workers.plus(calcAmt);
		
		refreshManpowerAmount("worker");
	}
}

function fireWorkerFromOre(name, amount, isActive) {
	var ore = game.data.ores[name];
	var worker = game.data.manpower.worker;
	
	var calcAmt = 0;
	
	if(ore.workers.gt(amount)) {
		calcAmt = new Decimal(amount);
	}
	else if(ore.workers.gt(0)) {
		calcAmt = ore.workers;
	}
	
	if(calcAmt.gt(0)) {
		ore.workers = ore.workers.minus(calcAmt);
		worker.owned = worker.owned.plus(calcAmt);
		
		refreshManpowerAmount("worker");
	}
}

function selectControlAmount(amt) {
	var ctrlAmountBtnPrev = document.getElementById("item_amt_selector_" + game.data.control.controlAmount);
	var ctrlAmountBtnCur = document.getElementById("item_amt_selector_" + amt);
	
	game.data.control.controlAmount = amt;
	
	addClass("disabled", ctrlAmountBtnCur);
	removeClass("disabled", ctrlAmountBtnPrev);
	
	swapClass("color-amt-", "color-amt-active", ctrlAmountBtnPrev);
	swapClass("color-amt-", "color-amt-toggled", ctrlAmountBtnCur);
}

function addOre(name, amount) {
	var ore = game.data.ores[name];
	if(ore) {
		ore.owned = ore.owned.plus(amount);
	
		if(ore.owned.gt(ore.max))
			ore.owned = ore.max;
	}
}

function sellOre(name, amount) {
	var ore = game.data.ores[name];
	if(ore) {
		if(ore.owned.gte(amount)) {
			game.data.money = game.data.money.plus(ore.worth.mul(amount));
			ore.owned = ore.owned.minus(amount);
		}
		else {
			game.data.money = game.data.money.plus(ore.worth.mul(ore.owned));
			ore.owned = ore.owned.minus(ore.owned);
		}
	}
}

function hireManpower(name, amount, isActive) {
	var manpower = game.data.manpower[name];
	if(manpower) {
		if(game.data.unemployed.gt(0)) {
			if(game.data.unemployed.lt(amount))
				amount = game.data.unemployed;
			
			manpower.owned = manpower.owned.plus(amount);
			manpower.max = manpower.max.plus(amount);
			game.data.unemployed = game.data.unemployed.minus(amount);
		}
		else if(isActive) {
			message("Can't hire " + game.data.control.controlAmount + " " + name + ". Not enough unemployment! Sabotage some innocent businesses.", "Warning");
		}
	}
}

function fireManpower(name, amount) {
	var manpower = game.data.manpower[name];
	
	if(manpower) {
		var calcAmt = 0;
		
		if(manpower.owned.gt(amount)) {
			calcAmt = new Decimal(amount);
		}
		else if(manpower.owned.gt(0)) {
			calcAmt = manpower.owned;
		}
		
		manpower.owned = manpower.owned.minus(calcAmt);
		manpower.max = manpower.max.minus(calcAmt);
		game.data.unemployed = game.data.unemployed.plus(calcAmt);
	}
}

function refreshOreAmount(name) {
	var ore = game.data.ores[name];
	if(ore) {
		document.getElementById("item_ore_amount_" + name).innerHTML = prettify(ore.owned) + "/" + prettify(ore.max);
		document.getElementById("item_ore_progress_" + name).style.width = ore.owned.dividedBy(ore.max).mul(100) + "%";
	}
}

function refreshBusinessAmount(place, name) {
	var business = game.data.places[place].businesses[name];
	if(business) {
		document.getElementById("item_business_workers_" + name).innerHTML = business.workers;
		document.getElementById("item_business_workers_max_" + name).innerHTML = business.workersMax;
	}
}

function refreshManpowerAmount(name) {
	var manpower = game.data.manpower[name];
	if(manpower) {
		document.getElementById("item_manpower_amount_" + name).innerHTML = prettify(manpower.owned) + "/" + prettify(manpower.max);
		document.getElementById("item_manpower_progress_" + name).style.width = manpower.owned.dividedBy(manpower.max.equals(0) ? 1 : manpower.max).mul(100) + "%";
	}
}

function refreshPlayerAmount() {
	document.getElementById("item_you_mining").innerHTML = game.data.player.you.mining.strength.toFixed(2) + "x";
	document.getElementById("item_you_intimidation").innerHTML = game.data.player.you.intimidation.strength.toFixed(2) + "x";
}

function refreshProgressForOre(name) {
	var prc = (game.data.ores[name].progress / game.data.ores[name].strength * 100).toFixed() + "%";
	document.getElementById("item_ore_progress_secondary_" + name).style.width = prc;
	document.getElementById("item_ore_amount_secondary_" + name).innerHTML = prc;
}

function refreshProgressForConvince(place, name) {
	var business = game.data.places[place].businesses[name];
	
	if(business) {
		var prc = (business.progress / business.strength * 100).toFixed() + "%";
		document.getElementById("item_business_progress_" + name).style.width = prc;
	}
}

function refreshOreWorkerAmount(name) {
	document.getElementById("item_ore_workers_" + name).innerHTML = game.data.ores[name].workers;
}

function refreshMoney() {
	document.getElementById("header_money_amount").innerHTML = "$" + game.data.money.toFixed(2);
}

function refreshUnemployed() {
	document.getElementById("header_unemployed_amount").innerHTML = prettify(game.data.unemployed);
}

function message(string, type) {
	var elem = document.getElementById("menu_info_log");
	switch(type) {
		case "Dev":
			elem.innerHTML += '<span class="info-log-entry">(o) ' + string + '</span><br>';
			break;
		case "Warning":
			elem.innerHTML += '<span class="info-log-entry">(!) ' + string + '</span><br>';
			break;
		default:
			elem.innerHTML += '<span class="info-log-entry">' + string + '</span><br>';
	}
}

function prettify(decimal) {
	return decimal.toNumber();
}

function swapClass(prefix, newClass, elem) {
	if (elem == null) {
		console.log("swapClass, No element found");
		return;
	}
	var className = elem.className;
	className = className.split(prefix);
	if(typeof className[1] === 'undefined') {
		console.log("swapClass function error: Tried to replace a class that doesn't exist at [" + elem.className + "] using " + prefix + " as prefix and " + newClass + " as target class.");
		elem.className += " " + newClass;
		return;
	}
	var classEnd = className[1].indexOf(' ');
	if (classEnd >= 0)
		className = className[0] + newClass + className[1].slice(classEnd, className[1].length);
	else
		className = className[0] + newClass;
	elem.className = className;
}

function removeClass(name, elem) {
	if (elem == null) {
		console.log("removeClass, No element found");
		return;
	}
	
	var a = elem.className.replace(name, "");
	var b = elem.className.replace(" " + name, "");
	var c = elem.className.replace(name + " ", "");
	
	if(b != elem.className)
		elem.className = b;
	else if(c != elem.className)
		elem.className = c;
	else
		elem.className = a;
}

function addClass(name, elem) {
	elem.className += " " + name;
}