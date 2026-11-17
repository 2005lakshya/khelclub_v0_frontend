import { Chip, Tooltip } from '@mui/material';
import { getMatchOutcome, hasSpecialOutcome } from './outcome';

// Small "Walkover" style tag. Renders nothing for normally played matches.
const OutcomeTag = ({ match, size = 'small', style }) => {
    if (!hasSpecialOutcome(match)) return null;
    const outcome = getMatchOutcome(match);
    const chip = (
        <Chip
            label={outcome.label}
            size={size}
            color="warning"
            data-outcome={outcome.type}
            style={{ fontWeight: 600, ...style }}
        />
    );
    return outcome.reason ? <Tooltip title={outcome.reason}>{chip}</Tooltip> : chip;
};

export default OutcomeTag;
