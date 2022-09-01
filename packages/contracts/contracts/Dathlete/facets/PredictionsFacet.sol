// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {Modifiers, ChallengeType, Prediction} from "../libraries/LibAppStorage.sol";
import {IERC20} from "../../shared/interfaces/IERC20.sol";

contract PredictionsFacet is Modifiers {
    event AddPrediction(Prediction prediction);
    event PredictionRefunded(Prediction prediction);
    event PredictionPayedOut(Prediction prediction);

    /***********************************|
   |             Write Functions        |
   |__________________________________*/

    function addPrediction(Prediction memory prediction) external {
        require(prediction.challengeId < s.challengeTypes.length, "PredictionsFacet: Challenge type doesn't exist");
        require(s.allowedTokens[prediction.token] == true, "PredictionsFacet: Token must be in allowed tokens list");
        require(prediction.isBeliever == true && prediction.token == s.prtcleContract, "PredictionsFacet: Believers must use Particle token");
        require(prediction.isBeliever == false && prediction.token != s.prtcleContract, "PredictionsFacet: Doubters cannot use Particle token");

        ChallengeType storage challenge = s.challengeTypes[prediction.challengeId];
        require(challenge.status == 0, "PredictionsFacet: Challenge is no longer open for Predictions");
        IERC20(prediction.token).transferFrom(msg.sender, address(this), prediction.amount);
        s.predictions.push(prediction);
        if (prediction.isBeliever) {
            s.predictionBelieverBalance[prediction.id] += prediction.amount;
        } else {
            s.predictionDoubterBalance[prediction.id][prediction.token] += prediction.amount;
        }
        emit AddPrediction(prediction);
    }

    function refundPrediction(uint256 _predictionId) external {
        Prediction storage prediction = s.predictions[_predictionId];
        ChallengeType storage challenge = s.challengeTypes[prediction.challengeId];
        require(prediction.owner == msg.sender, "PredictionsFacet: You do not own this prediction");
        require(challenge.status == 3, "PredictionsFacet: Challenge was not cancelled so refund is not allowed");
        uint256 amount = prediction.amount;
        prediction.amount = 0;
        IERC20(prediction.token).transferFrom(address(this), msg.sender, amount);
        emit PredictionRefunded(prediction);
    }

    function payoutPrediction(uint256 _predictionId) external {
        Prediction storage prediction = s.predictions[_predictionId];
        ChallengeType storage challenge = s.challengeTypes[prediction.challengeId];
        require(prediction.owner == msg.sender, "PredictionsFacet: You do not own this prediction");
        require(challenge.status == 2, "PredictionsFacet: Challenge has not completed so payout is not allowed");
        require(challenge.result != 0, "PredictionsFacet: No result has been recorded");
        require(challenge.result == 1 && prediction.isBeliever, "PredictionsFacet: Believers won! You are not a believer");
        require(challenge.result == 2 && !prediction.isBeliever, "PredictionsFacet: Doubters won! You are not a doubter");
        uint256 amount = prediction.amount;
        prediction.amount = 0;
        IERC20(prediction.token).transferFrom(address(this), msg.sender, amount);
        emit PredictionPayedOut(prediction);
    }
}
