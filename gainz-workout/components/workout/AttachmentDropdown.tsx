import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Attachment } from '@/models/Attachment';

interface AttachmentDropdownProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;  // Updated type
    selectedAttachment: string | null;
    setSelectedAttachment: React.Dispatch<React.SetStateAction<string | null>>;  // Updated type
    attachments: Attachment[];
    addAttachment: () => void;
}

export const AttachmentDropdown: React.FC<AttachmentDropdownProps> = ({
    open,
    setOpen,
    selectedAttachment,
    setSelectedAttachment,
    attachments,
    addAttachment,
}) => {
    return (
        <DropDownPicker
            open={open}
            value={selectedAttachment}
            items={attachments}
            onChangeValue={addAttachment}
            setOpen={setOpen}
            setValue={setSelectedAttachment}
            searchable={true}
            placeholder="Select Attachment"
            style={styles.dropdown}
            textStyle={{ color: Colors.light.text }}
            dropDownContainerStyle={{ backgroundColor: Colors.light.card }}
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: Colors.light.card,
        color: Colors.light.text,
    },
});