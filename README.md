 <!--
SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and contributors.

SPDX-License-Identifier: Apache-2.0
-->
# What is TUA Spartacus?

[![REUSE status](https://api.reuse.software/badge/github.com/SAP/spartacus-tua)](https://api.reuse.software/info/github.com/SAP/spartacus-tua)

Spartacus is a lean, Angular-based JavaScript storefront for SAP Commerce Cloud - Telco & Utilities Accelerator Module. TUA Spartacus talks to SAP Commerce Cloud (with Telco & Utilities Accelerator module embedded) exclusively through a set of REST APIs (OCC APIs). It also makes use of [Spartacus functionalities and libraries site](https://sap.github.io/spartacus-docs/)

- Documentation is hosted on our dedicated [TUA Spartacus Documentation site](https://sap.github.io/spartacus-docs/about-tua-spartacus/).
- Technical questions? Get in touch with us on [Slack workspace](https://spartacus-storefront.slack.com/archives/C014K1LRJAY).
- Non-technical questions? Join our [Slack workspace](https://spartacus-storefront.slack.com/archives/C014K1LRJAY).
- For details on the 1.0 launch, see the [Release Information page](https://sap.github.io/spartacus-docs/telco-release-information/) on our Spartacus TUA documentation site.

TUA Spartacus is...

- **Extendable**: TUA Spartacus is designed to be upgradable while maintaining full extendability. You'll be able to adopt new versions of Spartacus by updating the Spartacus libraries that we will regularly enhance. (In order to ensure that the first release is as extendable and upgradable as we'd like, breaking changes will very likely be introduced up until the 1.0 launch.)
- **Upgradable**: Spartacus code is published and used as libraries and follows semantic versioning conventions. By using the libraries, Spartacus is upgradable for minor and patch releases.
- **Progressive**: Spartacus is on a journey to be fully compliant with the Progressive Web Application (PWA) checklist. We aim to add support for all major features of a PWA-enabled storefront, to offer the best possible customer experience regardless of device or location.
- **Open Source**: Spartacus is open source. It will be continually developed by the SAP Commerce Cloud team, but we are very keen to welcome contributors and to foster an inclusive, active development community for Spartacus. See our [contributing documentation](https://sap.github.io/spartacus-docs/contributors-guide/) for more information.
- **Modern**: The Spartacus TUA storefront is part of our exciting new journey towards a customizable-yet-upgradable technology for SAP Commerce Cloud - Telco & Utilities Accelerator installations. See [SAP Customer Experience](https://cx.sap.com/en/products/commerce) for more information about SAP Commerce Cloud - Telco & Utilities Accelerator.

# Storefront Features

TUA Spartacus provides core storefront features such as:

- Storefront Navigation
- Search
- Categories
- Product Offerings
- Configurable Guided Selling
- Cart
- Checkout
- Order

See the [Release documentation](https://sap.github.io/spartacus-docs/telco-release-information/) for more information.

# Requirements

If you are working with TUA Spartacus 1.x, your Angular development environment should include the following:

- [Angular CLI](https://angular.io/): v8.0.0 or later, < v9.0.0
- node.js: v10 or later, < v12
- yarn: v1.15 or later

For the back end, SAP Commerce Cloud - Telco & Utilities Accelerator version 2003 is required.

# Download and Installation

To get up and running with Spartacus, the recommended approach is to build your storefront application from ready-made libraries. You can also clone and build from source, but upgrading is not as simple.

Spartacus currently can only be used with a SAP Commerce Cloud instance through Commerce APIs.

For complete setup instructions, see [Building the TUA Spartacus Storefront from Libraries](https://sap.github.io/spartacus-docs/getting-started-with-tua-spartacus/).

## Customizing and Extending Spartacus

To maintain our promise of upgradability, the design pattern for Spartacus is for non-core features to be built as feature libraries that add to or change the provided functionality.

When using TUA Spartacus, you build an app that pulls in the TUA Spartacus libraries, which contain the core resources needed to work with SAP Commerce Cloud - Telco & Utilities Accelerator. You then build new features that contain any custom functionality and pages.

Content for Spartacus pages is fetched from the SAP Commerce Cloud CMS (Content Management System), such as logos, links, banners and static pages. We recommend that new content-driven features follow the same pattern to enable Content Managers to modify page content through the CMS tools.

The documentation for customizing and extending Spartacus is still under development and is being released as it becomes available.



# Limitations

When 1.0.0 is released, it is recommended to use SAP Commerce - Telco & Utilities Accelerator, version 2003.

Spartacus is also being updated so that it works well with upcoming releases of SAP Commerce Cloud. This means that certain features of Spartacus may only work with unreleased future editions of SAP Commerce Cloud. This will be noted as we release new versions of Spartacus.

# Known Issues

Known issues are documented in the GitHub issue tracking system.

# How to Obtain Support

Spartacus is provided "as-is" with no official lines of support.

To get help from the TUA Spartacus community:

- For more general questions, post a question in the Help chat of our [Slack workspace](https://spartacus-storefront.slack.com/archives/C014K1LRJAY).

# Contributing

Team Spartacus welcomes feedback, ideas, requests, and especially code contributions.

- Post comments to our Feedback chat in our [Slack](https://spartacus-storefront.slack.com/archives/C014K1LRJAY) channel.
- Read the [Contributing document](https://sap.github.io/spartacus-docs/contributors-guide/) and learn how to:
  - Help others
  - Report an issue
  - Contribute code to Spartacus



# To Do

Many improvements are coming! All tasks will be posted to our GitHub issue tracking system. As mentioned, some of the improvements will mean breaking changes. While we strive to avoid doing so, we cannot guarantee this will not happen before the first release.



# License

Copyright 2020-2021 SAP SE or an SAP affiliate company and spartacus-tua contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/spartacus-tua).
