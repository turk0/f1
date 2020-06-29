import UserContext from '../components/UserContext';
import {Select, Stack, Button} from "@chakra-ui/core";

const moment = require('moment-timezone')
import styles from './OptionsBar.module.scss'
import withTranslation from 'next-translate/withTranslation'
import fixHref from 'next-translate/fixHref'

class OptionsBar extends React.Component {
    static contextType = UserContext

    constructor(props) {
        super(props)

        this.state = {
            pickerShowing: true
        }
    }

    componentDidMount() {
        this.setState({
            pickerShowing: false
        })
    }

    onChange = event => {
        this.context.setTimezone(event.target.value);
    }

    togglePicker = event => {
        event.preventDefault()

        this.setState({
            pickerShowing: !this.state.pickerShowing
        })
    }

    render() {
        const {t, lang} = this.props.i18n

        // Picker Items
        const timezoneItems = []

        const scrubbedPrefixes = ['Antarctica', 'Arctic', 'Canada', 'Chile', 'Etc', 'Mexico', 'US'];
        const scrubbedSuffixes = ['ACT', 'East', 'Knox_IN', 'LHI', 'North', 'NSW', 'South', 'West'];

        const tzNames = moment.tz.names()
            .filter(name => name.indexOf('/') !== -1)
            .filter(name => !scrubbedPrefixes.includes(name.split('/')[0]))
            .filter(name => !scrubbedSuffixes.includes(name.split('/').slice(-1)[0]));

        tzNames.reduce((memo, tz) => {
            memo.push({
                name: tz,
                offset: moment.tz(tz).utcOffset()
            });

            return memo;
        }, [])
            .sort((a, b) => {
                return a.offset - b.offset
            })
            .reduce((memo, tz) => {
                const timezone = tz.offset ? moment.tz(tz.name).format('Z') : '';

                timezoneItems.push(<option value={tz.name}
                                           key={tz.name}>(GMT{timezone}) {tz.name.replace("_", " ")}</option>);
            }, "");

        return (
            <div className={styles.options}>
                {this.state.pickerShowing ?
                    <Stack spacing={16} marginLeft={4} justify="start" align="center" className={styles.picker} isInline>
                        <label htmlFor="timezone"
                               className={styles.pickerLabel}>{t('common:options.timezonePicker.pick')}</label>
                        <Select id="timezone" name="timezone" size={"sm"} value={this.context.timezone}
                                onChange={this.onChange} rootProps={{minW: "250px", maxW: "350px", m:"0px", ml:"8px", mr:"16px"}} iconColor="black" className={styles.pickerSelect}>
                            {timezoneItems}
                        </Select>
                        <Button variantColor="white" size="sm" margin={0} onClick={this.togglePicker}>
                            {t('common:options.timezonePicker.button')}
                        </Button>
                        <noscript>
                            <style>{`#timezone-picker { display:none; } `}</style>
                        </noscript>
                    </Stack>
                    :
                    <div className={styles.options}>
                        <div className={styles.currentTimezone}>
                            <a onClick={this.togglePicker}>
                                {t('common:options.timezonePicker.showing')} <strong>{this.context.timezone && this.context.timezone.replace("_", " ")}</strong>.
                            </a>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withTranslation(OptionsBar)