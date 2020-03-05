declare module "buffer-to-stream"{
  import * as Stream from "stream";
  function toStream(buffer: Buffer): Stream
  export default toStream
}
