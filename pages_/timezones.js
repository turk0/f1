import Layout from "../components/Layout";
import {NextSeo} from 'next-seo';
import Link from 'next/link';
const moment = require('moment-timezone')
import useTranslation from 'next-translate/useTranslation'
import {Heading, Text} from "@chakra-ui/core";

function Timezones() {
    const {t, lang} = useTranslation()
    const title = t('common:title')
    const subtitle = t('common:subtitle')
    const currentYear = '2020';
    const metaDescription = t('common:meta.description', {year: currentYear})
    const metaKeywords = t('common:meta.keywords', {year: currentYear})

    // Picker Items
    const timezoneItems = []
    let zoneslist = moment.tz.names()
    for (let zone in zoneslist) {
        let timezoneSlug = zoneslist[zone].replace(/\//g, "-");
        timezoneItems.push(<li key={zoneslist[zone]}><Link href={`timezone/${timezoneSlug}`}><a>{zoneslist[zone]}</a></Link></li>)
    }

    return (
        <>
            <NextSeo
                title={`${title} ${currentYear} - ${subtitle}`}
                description={metaDescription}
                keywords={metaKeywords}
            />
            <Layout>
                    <Heading as="h3">{t('timezones:title')}</Heading>
                <section className="contentCard">
                    <p>
                        <ul>
                            {timezoneItems}
                        </ul>
                    </p>
                </section>
            </Layout>
        </>
    );
}

export default Timezones;