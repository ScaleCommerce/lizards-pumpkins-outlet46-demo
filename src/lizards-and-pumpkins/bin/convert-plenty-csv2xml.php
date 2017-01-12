#!/usr/bin/env php
<?php

declare(strict_types = 1);

require __DIR__ . '/../../../vendor/autoload.php';

(new \LizardsAndPumpkins\Import\PlentyCsv2LizardsXml(fopen('php://stdin', 'r')))->convert();
