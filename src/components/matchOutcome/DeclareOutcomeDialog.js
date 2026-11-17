import { useEffect, useState } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControlLabel, Radio, RadioGroup, TextField,
} from '@mui/material';
import toast from 'react-hot-toast';
import { declareMatchOutcome } from './outcome';

/*
 * Confirm a declared outcome (e.g. walkover) for a match: pick the winning team,
 * optionally give a reason. Works for any outcome the backend marks as declarable.
 *
 * teams: [{ team_id, label }, { team_id, label }]
 */
const DeclareOutcomeDialog = ({ open, onClose, outcome, matchId, tournamentId, teams = [], onDeclared }) => {
    const [winner, setWinner] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setWinner('');
            setReason('');
        }
    }, [open]);

    if (!outcome) return null;

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            const resp = await declareMatchOutcome(matchId, {
                outcome: outcome.type,
                winner_team_id: winner,
                tournament_id: tournamentId,
                reason,
                decided_by: 'referee',
            });
            toast.success(resp.message || `${outcome.label} recorded`);
            onDeclared?.(resp);
            onClose();
        } catch (error) {
            toast.error(error.message || `Failed to record ${outcome.label.toLowerCase()}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
            <DialogTitle>Declare {outcome.label}</DialogTitle>
            <DialogContent>
                {outcome.description && <p style={{ marginTop: 0 }}>{outcome.description}</p>}
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Which team wins?</p>
                <RadioGroup value={winner} onChange={(e) => setWinner(e.target.value)}>
                    {teams.map((team) => (
                        <FormControlLabel
                            key={team.team_id}
                            value={team.team_id}
                            control={<Radio />}
                            label={team.label}
                        />
                    ))}
                </RadioGroup>
                <TextField
                    label="Reason (optional)"
                    placeholder="e.g. Team did not report within 10 minutes"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    size="small"
                    margin="normal"
                    inputProps={{ maxLength: 255 }}
                />
                <p style={{ fontSize: 13, color: '#666', marginBottom: 0 }}>
                    The match will be marked completed and cannot be scored afterwards.
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting} style={{ color: '#F28C28' }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={!winner || submitting}
                    style={{ color: winner ? '#4CAF50' : undefined }}
                >
                    {submitting ? 'Saving...' : `Confirm ${outcome.label}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeclareOutcomeDialog;
