<?php

declare(strict_types=1);

namespace LizardsAndPumpkins\ProductListing\Import;

use LizardsAndPumpkins\Context\Context;
use LizardsAndPumpkins\Context\ContextBuilder;
use LizardsAndPumpkins\DataPool\KeyGenerator\SnippetKeyGenerator;
use LizardsAndPumpkins\DataPool\KeyValueStore\Snippet;
use LizardsAndPumpkins\Import\SnippetRenderer;

/**
 * @covers \LizardsAndPumpkins\ProductListing\Import\DemoProjectProductListingTitleSnippetRenderer
 */
class DemoProjectProductListingTitleSnippetRendererTest extends \PHPUnit_Framework_TestCase
{
    private $testSnippetKey = ProductListingTitleSnippetRenderer::CODE . '_foo';

    /**
     * @var ProductListingTitleSnippetRenderer
     */
    private $renderer;

    /**
     * @var ProductListing|\PHPUnit_Framework_MockObject_MockObject
     */
    private $stubProductListing;

    /**
     * @var SnippetKeyGenerator|\PHPUnit_Framework_MockObject_MockObject
     */
    private $stubProductListingTitleSnippetKeyGenerator;

    /**
     * @var ContextBuilder|\PHPUnit_Framework_MockObject_MockObject
     */
    private $stubContextBuilder;

    protected function setUp()
    {
        $this->stubProductListingTitleSnippetKeyGenerator = $this->createMock(SnippetKeyGenerator::class);
        $this->stubProductListingTitleSnippetKeyGenerator->method('getKeyForContext')
            ->willReturn($this->testSnippetKey);
        $this->stubContextBuilder = $this->createMock(ContextBuilder::class);
        $this->stubContextBuilder->method('createContext')->willReturn($this->createMock(Context::class));
        $this->renderer = new DemoProjectProductListingTitleSnippetRenderer(
            $this->stubProductListingTitleSnippetKeyGenerator,
            $this->stubContextBuilder
        );
        $this->stubProductListing = $this->createMock(ProductListing::class);
        $this->stubProductListing->method('getContextData')->willReturn([]);
    }
    
    public function testItImplementsTheSnippetRendererInterface()
    {
        $this->assertInstanceOf(SnippetRenderer::class, $this->renderer);
    }

    public function testEmptyArrayIsReturnedIfProductListingHasNoTitleAttribute()
    {
        $this->stubProductListing->method('hasAttribute')->with('meta_title')->willReturn(false);
        $this->assertSame([], $this->renderer->render($this->stubProductListing));
    }

    public function testItReturnsAProductListingTitleSnippet()
    {
        $testTitle = 'foo';

        $this->stubProductListing->method('hasAttribute')->with('meta_title')->willReturn(true);
        $this->stubProductListing->method('getAttributeValueByCode')->with('meta_title')->willReturn($testTitle);

        $result = $this->renderer->render($this->stubProductListing);
        $expectedSnippetContents = $testTitle . DemoProjectProductListingTitleSnippetRenderer::TITLE_SUFFIX;
        
        $this->assertInternalType('array', $result);
        $this->assertCount(1, $result);
        $this->assertContainsOnlyInstancesOf(Snippet::class, $result);
        $this->assertSame($this->testSnippetKey, $result[0]->getKey());
        $this->assertSame($expectedSnippetContents, $result[0]->getContent());
    }
}
