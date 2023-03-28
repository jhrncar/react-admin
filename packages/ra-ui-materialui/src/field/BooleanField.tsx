import * as React from 'react';
import { styled } from '@mui/material/styles';
import { SvgIconComponent } from '@mui/icons-material';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { Tooltip, Typography, TypographyProps } from '@mui/material';
import { Call, Objects } from 'hotscript';
import { useTranslate, useRecordContext } from 'ra-core';

import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { genericMemo } from './genericMemo';

const BooleanFieldImpl = <RecordType extends Record<string, any> = never>(
    props: BooleanFieldProps<RecordType>
) => {
    const {
        className,
        emptyText,
        source,
        valueLabelTrue,
        valueLabelFalse,
        TrueIcon = DoneIcon,
        FalseIcon = ClearIcon,
        looseValue = false,
        ...rest
    } = props;
    const record = useRecordContext<RecordType>(props);
    const translate = useTranslate();

    const value = get(record, source);
    const isTruthyValue = value === true || (looseValue && value);
    let ariaLabel = value ? valueLabelTrue : valueLabelFalse;

    if (!ariaLabel) {
        ariaLabel = isTruthyValue ? 'ra.boolean.true' : 'ra.boolean.false';
    }

    if (looseValue || value === false || value === true) {
        return (
            <StyledTypography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                <Tooltip title={translate(ariaLabel, { _: ariaLabel })}>
                    {isTruthyValue ? (
                        TrueIcon ? (
                            <TrueIcon data-testid="true" fontSize="small" />
                        ) : (
                            <></>
                        )
                    ) : FalseIcon ? (
                        <FalseIcon data-testid="false" fontSize="small" />
                    ) : (
                        <></>
                    )}
                </Tooltip>
            </StyledTypography>
        );
    }

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {emptyText && translate(emptyText, { _: emptyText })}
        </Typography>
    );
};

export const BooleanField = genericMemo(BooleanFieldImpl);

// @ts-ignore
BooleanField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    valueLabelFalse: PropTypes.string,
    valueLabelTrue: PropTypes.string,
    TrueIcon: PropTypes.elementType,
    FalseIcon: PropTypes.elementType,
    looseValue: PropTypes.bool,
};

// @ts-ignore
BooleanField.displayName = 'BooleanField';

export interface BooleanFieldProps<
    RecordType extends Record<string, any> = never
> extends PublicFieldProps,
        InjectedFieldProps,
        Omit<TypographyProps, 'textAlign'> {
    valueLabelTrue?: string;
    valueLabelFalse?: string;
    TrueIcon?: SvgIconComponent | null;
    FalseIcon?: SvgIconComponent | null;
    looseValue?: boolean;
    source?: [RecordType] extends [never]
        ? string
        : Call<Objects.AllPaths, RecordType>;
    sortBy?: [RecordType] extends [never]
        ? string
        : Call<Objects.AllPaths, RecordType>;
}

const PREFIX = 'RaBooleanField';

const StyledTypography = styled(Typography, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    display: 'inline-flex',
    verticalAlign: 'middle',
    lineHeight: 0,
});
