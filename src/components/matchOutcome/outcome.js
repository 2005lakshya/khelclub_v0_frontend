import { useEffect, useState } from 'react';
import { endpoints } from '@/store/urls';
import { apiCall } from '@/store/utils';

/*
 * Match outcomes (normal, walkover, ...) are defined once, in the backend
 * (match_outcomes.py). API responses carry an `outcome` object such as
 *   { type: 'walkover', label: 'Walkover', short_label: 'W/O',
 *     decided_without_play: true, reason: '...' }
 * These helpers only read that object, so a new backend outcome (e.g. forfeit)
 * shows up in the UI without frontend changes.
 */

// Fixtures put the outcome under match_status; other endpoints put it at the top level.
export const getMatchOutcome = (match) =>
    match?.outcome || match?.match_status?.outcome || null;

// Anything other than a normally played match gets a visible tag.
export const hasSpecialOutcome = (match) => {
    const outcome = getMatchOutcome(match);
    return Boolean(outcome && outcome.type !== 'normal');
};

export const isDecidedWithoutPlay = (match) =>
    Boolean(getMatchOutcome(match)?.decided_without_play);

// What to show in a score slot: e.g. "W/O" for a walkover, otherwise the score itself.
export const displayScore = (match, score) =>
    isDecidedWithoutPlay(match) ? getMatchOutcome(match).short_label : score;

// Winner's display name for a fixtures-API match ({ team1: { team_id, name }, team2: ... }).
export const winnerName = (match) => {
    const winnerId = match?.match_status?.winner_team_id ?? match?.winner_team_id;
    const winner = [match?.team1, match?.team2].find((t) => t && t.team_id === winnerId);
    return winner ? (winner.name || winner.team_id) : null;
};

// One-line result text, e.g. "Walkover · Thunder Smash won" or "11-7".
export const resultText = (match) => {
    if (!hasSpecialOutcome(match)) return match?.match_result;
    const outcome = getMatchOutcome(match);
    const name = winnerName(match);
    return name ? `${outcome.label} · ${name} won` : outcome.label;
};

let declarableOutcomesPromise = null;

// Outcomes an official can declare on a match (from GET /match-outcomes), fetched once.
export const useDeclarableOutcomes = () => {
    const [outcomes, setOutcomes] = useState([]);
    useEffect(() => {
        if (!declarableOutcomesPromise) {
            declarableOutcomesPromise = apiCall(endpoints.matchOutcomes)
                .then((resp) => (resp?.outcomes || []).filter((o) => o.declarable))
                .catch((error) => {
                    declarableOutcomesPromise = null;
                    console.error('Failed to load match outcomes:', error);
                    return [];
                });
        }
        let active = true;
        declarableOutcomesPromise.then((list) => active && setOutcomes(list));
        return () => { active = false; };
    }, []);
    return outcomes;
};

export const declareMatchOutcome = (matchId, body) =>
    apiCall(`${endpoints.matches}/${matchId}/outcome`, { method: 'POST', body });
