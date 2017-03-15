// Google AdWords custom targer position script
// Copyright (C) 2017 Jacek Kowalski
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
			    
var TARGET_POSITION = 1.8;

var TOLERANCE = 0.1;

var ADJUSTMENT_MULTIPLIER = 1.05;

var CAMPAIGN_NAME = "Test campaign";

var MAX_CPC = 2.8;

var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;

function main() {

	var now = new Date();
	var from = new Date(now.getTime() - 1 * MILLIS_PER_DAY);
	var to = new Date(now.getTime());
	var timeZone = AdWordsApp.currentAccount().getTimeZone();

		var keywordsToRaise = AdWordsApp
			.keywords()
			.withCondition('Status = ENABLED')
			.withCondition('AveragePosition > ' + (TARGET_POSITION + TOLERANCE) )
			.withCondition("CampaignName CONTAINS_IGNORE_CASE '" + CAMPAIGN_NAME + "'")
			.orderBy('AveragePosition ASC')
			.forDateRange(Utilities.formatDate(from, timeZone, 'yyyyMMdd'),Utilities.formatDate(to, timeZone, 'yyyyMMdd'))
			.get();
		    
		var keywordsToLower = AdWordsApp
			.keywords()
			.withCondition('Status = ENABLED')
			.withCondition('AveragePosition < ' + (TARGET_POSITION - TOLERANCE) )
			.withCondition("CampaignName CONTAINS_IGNORE_CASE '" + CAMPAIGN_NAME + "'")
			.orderBy('AveragePosition ASC')
			.forDateRange(Utilities.formatDate(from, timeZone, 'yyyyMMdd'),Utilities.formatDate(to, timeZone, 'yyyyMMdd'))
			.get();

		while (keywordsToRaise.hasNext()) {
			var keyword = keywordsToRaise.next();
			var new_cpc = keyword.getMaxCpc() * ADJUSTMENT_MULTIPLIER;
			if (new_cpc < MAX_CPC) {
				keyword.setMaxCpc(new_cpc);
			}
		}
				
		while (keywordsToLower.hasNext()) {
			var keyword = keywordsToLower.next();
			var new_cpc = keyword.getMaxCpc() * (1 - (ADJUSTMENT_MULTIPLIER - 1));
			if (new_cpc < MAX_CPC) {
			keyword.setMaxCpc(new_cpc);
			}
		}
}
