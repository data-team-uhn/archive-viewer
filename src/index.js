import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import ArchiveApp from './components/ArchiveApp';

import { LicenseInfo } from '@mui/x-license-pro';
import DevConfig from './config/devConfig.json';
LicenseInfo.setLicenseKey(DevConfig.licenseKey);

const container = document.getElementById('app');
const root = ReactDOMClient.createRoot(container);

root.render(<ArchiveApp />);
