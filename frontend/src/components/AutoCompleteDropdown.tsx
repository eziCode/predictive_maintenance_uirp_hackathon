import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {FC} from 'react';
import {useFuelAutocompleteProps} from '@deere/fuel-react/useFuelAutocompleteProps';
import modelDropdown from './DropdownValues';
import graphDropdown from './DataVisualizationDropdown';

interface AutoCompleteDropdownProps {
    onChange: (event: { target: { value: string } }) => void;
    name: string; // Optional name prop for the input
}

const AutoCompleteDropdown: FC<AutoCompleteDropdownProps> = ({ onChange, name }) => {
    const autocompleteProps = useFuelAutocompleteProps();

    return (
        <Autocomplete style={{ marginLeft: '1rem', marginTop: '1rem', marginBottom: (name!=='Model' ? '1rem' : '0') }}
            {...autocompleteProps}
            options={name === 'Model' ? modelDropdown: graphDropdown}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={`Select ${name}`}
                    placeholder={'Start Typing...'}
                />
            )}
            onChange={(event, value) => {
                const stringValue = value ? (typeof value === 'string' ? value : value.label ?? value.value ?? '') : '';
                onChange({ target: { value: stringValue } });
            }}
        />
    
    );
};

export default AutoCompleteDropdown;