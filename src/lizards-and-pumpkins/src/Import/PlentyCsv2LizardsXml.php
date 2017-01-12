<?php

declare(strict_types = 1);

namespace LizardsAndPumpkins\Import;

class PlentyCsv2LizardsXml
{
    /**
     * @var resource
     */
    private $handle;

    /**
     * @var string[]
     */
    private $categories = [];

    public function __construct($resource)
    {
        $this->throwAwayFirstRow($resource);
        $this->handle = $resource;
    }

    private function throwAwayFirstRow($resource)
    {
        fgetcsv($resource);
    }

    public function convert()
    {
        echo <<<EOXML_START
<?xml version="1.0"?>
<catalog xmlns="http://lizardsandpumpkins.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://lizardsandpumpkins.com ../../schema/catalog.xsd">
    <products>
EOXML_START;
        while (! feof($this->handle)) {
            if ($row = fgetcsv($this->handle, null, ';')) {
                echo $this->buildProductXml($row);
            }
        }
        echo "    </products>\n";
        echo "    <listings>\n";
        
        foreach (array_keys($this->categories) as $category) {
            echo $this->buildListingXml($category);
        }
        
        echo <<<EOXML_END
    </listings>
</catalog>
EOXML_END;

    }

    private function buildProductXml(array $row)
    {
        if (! isset($row[0]) || ! $row[0]) {
            return '';
        }
        $xml = new \XMLWriter();
        $xml->openMemory();
        $xml->setIndent(true);
        $xml->startElement('product');
        $xml->writeAttribute('type', 'simple');
        $xml->writeAttribute('sku', $row[0]);
        $xml->writeAttribute('tax_class', 'Taxable Goods');

//        if (isset($row[10])) {
//            $xml->startElement('images');
//            foreach (explode(',', $row[10]) as $image) {
//                $xml->startElement('image');
//                $xml->writeElement('file', trim($image));
//                $xml->writeElement('label', $row[3]);
//                $xml->endElement();
//            }
//            $xml->endElement();
//        }

        $xml->startElement('attributes');
        $this->writeAttribute($xml, 'manufacturer', $row[1]);
        $this->writeAttribute($xml, 'model', $row[2]);
        $this->writeAttribute($xml, 'name', $row[3]);
        $this->writeAttribute($xml, 'short_description', $row[4]);
        $this->writeAttribute($xml, 'price', str_replace(',', '.', $row[5]));
        $this->writeAttribute($xml, 'description', $row[6]);
        $this->writeAttribute($xml, 'technical_details', $row[7]);
        $this->writeAttribute($xml, 'url_key', $this->get_path_from_url($row[9]), ['website' => 'de']);
        $this->writeAttribute($xml, 'category', $row[11]);
        $this->writeAttribute($xml, 'category', $row[12]);
        $this->categories[$row[11]] = true;
        if (isset($row[10])) {
            foreach (explode(',', $row[10]) as $image) {
                $this->writeAttribute($xml, 'image', trim($image));
            }
        }
        $xml->endElement();

        $xml->endElement();
        return $xml->flush();
    }

    private function writeAttribute(\XMLWriter $xml, string $name, string $value, array $additional = [])
    {
        $xml->startElement('attribute');
        $xml->writeAttribute('name', $name);
        foreach ($additional as $ak => $av) {
            $xml->writeAttribute($ak, $av);
        }
        if ($this->isCDataNeeded($value)) {
            $value = str_replace(']]>', ']]]]><![CDATA[', $value);
            $xml->writeCdata($value);
        } else {
            $xml->text($value);
        }
        $xml->endElement();
    }

    private function get_path_from_url(string $url): string
    {
        return rtrim(str_replace('http://www.outlet46.de/', '', $url), '/');
    }


    private function isCDataNeeded($value)
    {
        $xmlUnsafeCharacters = ['&', '<', '"', "'", '>'];

        foreach ($xmlUnsafeCharacters as $string) {
            if (strpos($value, $string) !== false) {
                return true;
            }
        }
        return false;
    }
    
    private function buildListingXml($category)
    {
        $xml = new \XMLWriter();
        $xml->openMemory();
        $xml->setIndent(true);
        
        $xml->startElement('listing');
        $xml->writeAttribute('url_key', $category);
        $xml->writeAttribute('website', 'de');
        $xml->writeAttribute('locale', 'de_DE');
        
        $xml->startElement('criteria');
        $xml->writeAttribute('type', 'and');
        $this->writeAttribute($xml, 'category', $category, ['is' => 'Equal']);
        $xml->endElement();
        
        $xml->startElement('attributes');
        $this->writeAttribute($xml, 'meta_title', $category);
        $xml->endElement();
        
        $xml->endElement();
        
        return $xml->flush();
    }
}
